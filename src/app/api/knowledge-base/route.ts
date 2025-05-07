import { NextRequest, NextResponse } from 'next/server';
import { webScrapingAgent } from '@/lib/mastra';

// Mock database for knowledge base articles
let knowledgeBaseArticles = [
  {
    id: '1',
    title: 'Getting Started with SPEAR',
    slug: 'getting-started-with-spear',
    content: 'This is a guide to getting started with SPEAR, the Secure Platform for Extended Augmented Reality.',
    keywords: ['SPEAR', 'getting started', 'setup', 'onboarding'],
    category: 'Guides',
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'TeamViewer Integration Guide',
    slug: 'teamviewer-integration-guide',
    content: 'Learn how to integrate TeamViewer with SPEAR for remote device management.',
    keywords: ['TeamViewer', 'integration', 'remote access', 'setup'],
    category: 'Integrations',
    createdAt: '2023-02-10T00:00:00.000Z',
    updatedAt: '2023-02-10T00:00:00.000Z',
  },

];

// GET handler for retrieving knowledge base articles
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const query = searchParams.get('query');

  // Return a specific article by ID
  if (id) {
    const article = knowledgeBaseArticles.find(article => article.id === id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  // Return a specific article by slug
  if (slug) {
    const article = knowledgeBaseArticles.find(article => article.slug === slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  // Filter by category
  if (category) {
    const filteredArticles = knowledgeBaseArticles.filter(
      article => article.category.toLowerCase() === category.toLowerCase()
    );
    return NextResponse.json(filteredArticles);
  }

  // Search by query
  if (query) {
    const filteredArticles = knowledgeBaseArticles.filter(
      article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase()) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    );
    return NextResponse.json(filteredArticles);
  }

  // Return all articles
  return NextResponse.json(knowledgeBaseArticles);
}

// POST handler for creating new knowledge base articles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Check if slug already exists
    if (knowledgeBaseArticles.some(article => article.slug === slug)) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 400 }
      );
    }

    // Create new article
    const newArticle = {
      id: (knowledgeBaseArticles.length + 1).toString(),
      title: body.title,
      slug,
      content: body.content,
      keywords: body.keywords || [],
      category: body.category || 'Uncategorized',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    knowledgeBaseArticles.push(newArticle);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating knowledge base article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

// PUT handler for updating knowledge base articles
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Find the article
    const articleIndex = knowledgeBaseArticles.findIndex(article => article.id === body.id);
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Update the article
    const updatedArticle = {
      ...knowledgeBaseArticles[articleIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    knowledgeBaseArticles[articleIndex] = updatedArticle;

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating knowledge base article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE handler for removing knowledge base articles
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Article ID is required' },
      { status: 400 }
    );
  }

  // Find the article
  const articleIndex = knowledgeBaseArticles.findIndex(article => article.id === id);
  if (articleIndex === -1) {
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }

  // Remove the article
  const deletedArticle = knowledgeBaseArticles[articleIndex];
  knowledgeBaseArticles = knowledgeBaseArticles.filter(article => article.id !== id);

  return NextResponse.json(deletedArticle);
}
