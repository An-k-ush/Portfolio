const posts = [
  {
    title: "How I Built CP Arena with Spring Boot + React",
    date: "2026-02-07",
    readTime: "6 min read",
    excerpt:
      "A practical breakdown of the architecture decisions behind CP Arena, from stateless JWT auth to asynchronous code judging.",
    tags: ["Spring Boot", "React", "REST API"],
  },
  {
    title: "Competitive Programming Habits That Actually Scale",
    date: "2026-01-28",
    readTime: "4 min read",
    excerpt:
      "The routines that helped me cross 800+ solved problems while balancing academics and development projects.",
    tags: ["CodeChef", "Codeforces", "Problem Solving"],
  },
  {
    title: "Designing Secure Backend Systems for Student Projects",
    date: "2025-12-15",
    readTime: "5 min read",
    excerpt:
      "Security-first practices you can adopt early: layered architecture, route protection, and testable auth flows.",
    tags: ["Security", "Spring Security", "Architecture"],
  },
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderPosts() {
  const container = document.getElementById("blogList");
  container.innerHTML = posts
    .map(
      (post) => `
      <article class="blog-card">
        <p class="muted">${formatDate(post.date)} · ${post.readTime}</p>
        <h2>${post.title}</h2>
        <p>${post.excerpt}</p>
        <div class="tags">${post.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </article>
    `,
    )
    .join("");
}

renderPosts();
