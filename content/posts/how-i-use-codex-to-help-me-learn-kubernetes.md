---
title: "How I Use Codex to Help Me Learn Kubernetes"
description: "A practical note on using Codex as a conversational mentor while building real Kubernetes intuition."
date: 2026-06-05
lastmod: 2026-06-05
topics: ["kubernetes", "tooling"]
---

When people hear that I'm learning Kubernetes, they often assume I'm working through a certification course, reading books cover-to-cover, or following a structured training program.

The reality is much messier.

Most of my learning happens while I'm building things, breaking things, and asking questions.

And increasingly, my favorite learning tool has become Codex.

## The Problem With Learning Kubernetes

Kubernetes has an enormous surface area.

You start by learning Pods, then Deployments, then Services, then Ingresses. Before long you're trying to understand:

- Networking
- Storage
- RBAC
- Service Accounts
- Operators
- Helm
- GitOps
- StatefulSets
- Affinity rules
- Taints and tolerations
- CNI plugins
- CSI drivers
- Certificate management

The challenge isn't finding information.

The challenge is understanding how all the pieces fit together.

I found that many tutorials teach *what* a resource does, but not necessarily *why it exists*, *when to use it*, or *what problem it was designed to solve*.

That's where having an AI pair-programmer becomes incredibly useful.

## My Learning Workflow

When I encounter a concept I don't understand, I don't ask for a definition.

Instead, I ask questions like:

- Why does this exist?
- What problem does it solve?
- What would happen if it didn't exist?
- What are the alternatives?
- When should I not use it?

For example, instead of asking:

> What is a StatefulSet?

I'll ask:

> Why can't I just use a Deployment? What breaks if I do?

That usually leads to a much deeper understanding.

The goal isn't memorization.

The goal is building mental models.

## Learning Through Conversation

One thing I particularly like about Codex is that I can keep drilling deeper.

A typical learning path might look like:

```text
What is a StatefulSet?

↓

Why can't a Deployment do that?

↓

How does DNS work for StatefulSets?

↓

What creates those DNS records?

↓

How does CoreDNS know about them?

↓

Where is that information stored?
```

Eventually you're tracing a feature all the way down to the Kubernetes API.

That's where the real learning happens.

## The Skill I Built

As I spent more time learning Kubernetes, I noticed I was repeatedly asking Codex for the same type of explanations.

I wanted answers that were:

- Beginner friendly
- Practical
- Focused on understanding rather than memorization
- Based on real-world examples
- Willing to go as deep as necessary

So I created a custom Codex skill:

**learn-k8s**

GitHub:

https://github.com/danohn/learn-k8s

The goal of the skill is simple:

When I ask Kubernetes questions, I want Codex to act more like an experienced mentor than a search engine.

Rather than immediately jumping into API definitions, I want explanations that:

1. Start with the problem being solved.
2. Build intuition first.
3. Introduce the Kubernetes resource afterwards.
4. Use examples from real clusters.
5. Encourage follow-up questions.

In other words, teach Kubernetes the way a senior engineer might teach it to a junior engineer.

## Building a Real Cluster

The biggest mistake I made early on was trying to learn Kubernetes entirely from diagrams.

Kubernetes only really starts making sense when you operate a cluster yourself.

Over the last few months I've built clusters using:

- kubeadm
- k3s
- Talos Linux
- Managed Kubernetes services

Every time something broke, I learned more.

A failed CNI install taught me networking.

A broken Ingress taught me traffic flow.

A storage issue taught me persistent volumes.

An authentication issue taught me RBAC.

Production-grade systems are excellent teachers.

## AI Doesn't Replace Hands-On Experience

I don't think AI replaces documentation.

I don't think AI replaces labs.

And it definitely doesn't replace operating real systems.

What it does provide is immediate feedback.

Instead of spending an hour piecing together five different blog posts, I can have a conversation.

I can ask "why" repeatedly until the concept clicks.

That's the part that accelerates learning.

## What's Next?

I'm still very much on my Kubernetes learning journey.

There are plenty of topics I haven't mastered yet:

- Advanced networking
- Multi-cluster architectures
- Service meshes
- Operators
- Production-scale observability
- Advanced scheduling

But I've found that combining:

1. Real clusters
2. Documentation
3. Hands-on experimentation
4. AI-assisted learning

has been one of the most effective ways I've ever learned a technology.

If you're learning Kubernetes yourself, I'd encourage you to build something real, break it, fix it, and ask lots of questions along the way.

The best learning happens one "why?" at a time.
