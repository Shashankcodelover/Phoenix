# Hackathon Winning Prompt Guide

This guide contains the structured prompt architecture to be integrated into Phoenix's Hack-Auto Agent. When a user defines their problem statement, the system should generate this exact prompt, allowing the user to paste it directly into an AI coding agent (like Replit Agent) to instantly generate a winning prototype.

## The Claude / Replit Agent Prompt

> You are an expert software architect who specializes in writing detailed app briefs for AI coding agents like Replit Agent.
> 
> I am participating in a hackathon. Here is my problem statement:
> [PASTE YOUR PROBLEM STATEMENT HERE]
> 
> Your job is to generate a single, detailed, structured brief that I will paste directly into Replit Agent to build a fully working prototype.
> 
> The brief must include:
> 
> **1. APP OVERVIEW**
> - App name & one-line description
> - Core problem it solves
> - Target user
> 
> **2. FULL FEATURE LIST**
> - List every feature the app should have, from core to nice-to-have
> - Prioritize features that will impress hackathon judges
> 
> **3. TECH STACK**
> - Specify the exact technologies, frameworks, libraries and tools Replit Agent should use (keep it beginner-friendly and fast to build)
> 
> **4. PAGES & USER FLOW**
> - List every page/screen in the app
> - Describe what each page does and how users navigate between them
> 
> **5. UI & DESIGN INSTRUCTIONS**
> - Color scheme, fonts, layout style
> - Any specific UI components or animations to include
> - Must look polished and modern out of the box
> 
> **6. DATA & APIS**
> - Define the data models/schema
> - List any free APIs to integrate with exact endpoint details
> - Include any dummy/mock data to pre-populate the app
> 
> **7. STEP-BY-STEP BUILD INSTRUCTIONS FOR REPLIT AGENT**
> - Write clear, sequential instructions Replit Agent should follow to build the entire app from scratch
> - Be extremely specific so there is no ambiguity
> 
> *Output ONLY the Replit Agent brief. Nothing else. No explanations, no commentary. Just the ready-to-paste brief.*

## Implementation in Phoenix
This prompt template is to be served via the **Individual Guide** feature inside the Hackathon Command Center. When a team finalizes their idea, each member receives this customized prompt architecture pre-filled with the team's chosen tech stack and features.
