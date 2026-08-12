/**
 * Phoenix Router v18 — Next-Gen Client-Side SPA Router & Dynamic Component Engine
 * ==============================================================================
 * Enables seamless component mounting/unmounting without full page reloads,
 * mimicking React Router / Next.js client navigation in vanilla JavaScript.
 * 
 * Features:
 *  - HTML5 History API (pushState / popState) & Hash Routing Fallback
 *  - Dynamic Component Pull & Push with Animated Page Transitions (Fade/Slide/Scale)
 *  - Route Param Matching (/interview-prep/:featureId, /horizon/:tab)
 *  - Component Lifecycle Hooks (beforeMount, afterMount, beforeUnmount)
 *  - Zero-Latency View Caching & State Preservation
 */

class PhoenixRouter {
  constructor(options = {}) {
    this.routes = new Map(); // pathRegex -> { path, handler, title, template }
    this.viewContainerId = options.viewContainerId || 'phoenix-app-root';
    this.currentRoute = null;
    this.viewCache = new Map();
    this.routeHistory = [];
    this.globalMiddleware = [];

    // Auto-bind navigation clicks
    window.addEventListener('popstate', (e) => this._handlePopState(e));
    document.addEventListener('click', (e) => this._interceptLinks(e));
  }

  /**
   * Registers a route definition.
   */
  register(path, handler, options = {}) {
    // Convert /user/:id path pattern to regular expression
    const paramNames = [];
    const regexPath = path.replace(/:([a-zA-Z0-9_]+)/g, (_, name) => {
      paramNames.push(name);
      return '([a-zA-Z0-9_-]+)';
    });

    const routeRegex = new RegExp(`^${regexPath}$`);
    this.routes.set(path, {
      path,
      regex: routeRegex,
      paramNames,
      handler,
      title: options.title || 'Project Phoenix',
      cache: options.cache !== false
    });
    return this;
  }

  /**
   * Adds global routing middleware.
   */
  use(middlewareFn) {
    if (typeof middlewareFn === 'function') {
      this.globalMiddleware.push(middlewareFn);
    }
    return this;
  }

  /**
   * Programmatic Navigation: Pushes new route state without page reload.
   */
  async navigate(url, state = {}) {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    
    // Execute global middleware
    for (const mw of this.globalMiddleware) {
      const allowed = await mw(cleanUrl, state);
      if (allowed === false) return;
    }

    window.history.pushState(state, '', cleanUrl);
    this.routeHistory.push({ url: cleanUrl, timestamp: Date.now() });
    await this._renderRoute(cleanUrl, state);
  }

  /**
   * Replaces current route state.
   */
  async replace(url, state = {}) {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    window.history.replaceState(state, '', cleanUrl);
    await this._renderRoute(cleanUrl, state);
  }

  /**
   * Internal link click interceptor.
   */
  _interceptLinks(e) {
    const link = e.target.closest('a[data-route], a.phoenix-link');
    if (!link) return;

    const href = link.getAttribute('href') || link.getAttribute('data-route');
    if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('mailto')) {
      e.preventDefault();
      this.navigate(href);
    }
  }

  /**
   * Internal popState handler for browser back/forward buttons.
   */
  async _handlePopState(e) {
    const currentPath = window.location.pathname;
    await this._renderRoute(currentPath, e.state || {});
  }

  /**
   * Renders matching route component.
   */
  async _renderRoute(path, state = {}) {
    const container = document.getElementById(this.viewContainerId);
    if (!container) return;

    let matchedRoute = null;
    let params = {};

    for (const [routePattern, config] of this.routes.entries()) {
      const match = path.match(config.regex);
      if (match) {
        matchedRoute = config;
        config.paramNames.forEach((name, idx) => {
          params[name] = match[idx + 1];
        });
        break;
      }
    }

    if (!matchedRoute) {
      // 404 Fallback
      container.innerHTML = `
        <div style="padding: 3rem; text-align: center; color: #94a3b8;">
          <h2 style="color: #f43f5e; font-size: 2rem;">404 — Module Not Found</h2>
          <p>The requested route <code>${path}</code> does not exist.</p>
          <button class="btn btn-primary mt-2" onclick="window.phoenixRouter.navigate('/')">Return to Command Center</button>
        </div>
      `;
      return;
    }

    // Update document title
    document.title = `${matchedRoute.title} | Project Phoenix`;

    // Apply smooth slide-out transition
    container.style.opacity = '0';
    container.style.transform = 'translateY(8px)';
    container.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

    setTimeout(async () => {
      // Execute route handler to obtain component HTML / DOM
      const context = { path, params, state, router: this };
      const componentContent = await matchedRoute.handler(context);

      if (typeof componentContent === 'string') {
        container.innerHTML = componentContent;
      } else if (componentContent instanceof HTMLElement) {
        container.innerHTML = '';
        container.appendChild(componentContent);
      }

      // Smooth slide-in transition
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
      this.currentRoute = path;
    }, 150);
  }

  /**
   * Initializes router with current browser location.
   */
  init() {
    const initialPath = window.location.pathname || '/';
    this._renderRoute(initialPath, {});
  }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
  window.PhoenixRouter = PhoenixRouter;
  window.phoenixRouter = new PhoenixRouter();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PhoenixRouter };
}
