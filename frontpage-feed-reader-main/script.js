const categories = [
  { name: "Frontend", dot: "#3b82f6" },
  { name: "CSS-Tricks", dot: "#ef4444" },
  { name: "Smashing Mag", dot: "#f97316" },
  { name: "Josh Comeau", dot: "#6366f1" },
  { name: "Kent C. Dodds", dot: "#2563eb" },
  { name: "web.dev", dot: "#0ea5e9" },
  { name: "Design", dot: "#ec4899" },
  { name: "Sidebar.io", dot: "#a855f7" },
  { name: "NN Group", dot: "#22c55e" },
  { name: "Figma Blog", dot: "#111827" },
  { name: "UX Collective", dot: "#1d4ed8" },
  { name: "Backend & DevOps", dot: "#f59e0b" },
  { name: "General Tech", dot: "#6366f1" },
  { name: "AI & ML", dot: "#8b5cf6" }
];

const tagColors = {
  "Design": { bg: "#fce7f3", fg: "#9d174d" },
  "Backend & DevOps": { bg: "#fef3c7", fg: "#92400e" },
  "AI & ML": { bg: "#ede9fe", fg: "#5b21b6" },
  "Frontend": { bg: "#dbeafe", fg: "#1d4ed8" }
};

const sourceColors = {
  "Smashing Magazine": "#ef4444",
  "Cloudflare Blog": "#f97316",
  "Simon Willison": "#111827",
  "Josh Comeau": "#6366f1",
  "Figma Blog": "#111827",
  "Vercel Blog": "#000000",
  "UX Collective": "#1d4ed8"
};

const items = [
  {
    id: "1",
    source: "Smashing Magazine",
    ago: "2h ago",
    title: "Practical Guide To Designing For Colorblind Users",
    excerpt: "Color blindness affects millions worldwide. Most interfaces still rely heavily on color to convey meaning, status, and hierarchy.",
    tag: "Design",
    category: "Design",
    unread: true,
    saved: false
  },
  {
    id: "2",
    source: "Cloudflare Blog",
    ago: "3h ago",
    title: "How We Reduced P99 Latency by 60% with Edge-First Caching",
    excerpt: "Our engineering team rethought cache placement at the edge and dramatically reduced tail latency for demanding workloads.",
    tag: "Backend & DevOps",
    category: "Backend & DevOps",
    unread: true,
    saved: false
  },
  {
    id: "3",
    source: "Simon Willison",
    ago: "4h ago",
    title: "Building Effective RAG Systems: What Actually Works in Production",
    excerpt: "After months of experiments, here is what worked for retrieval-augmented generation in real systems and what failed.",
    tag: "AI & ML",
    category: "AI & ML",
    unread: true,
    saved: true
  },
  {
    id: "4",
    source: "Josh Comeau",
    ago: "5h ago",
    title: "The Surprising Truth About CSS Container Queries",
    excerpt: "Container queries unlock truly reusable components, but most teams still use them like media queries with different syntax.",
    tag: "Frontend",
    category: "Frontend",
    unread: true,
    saved: false
  },
  {
    id: "5",
    source: "Figma Blog",
    ago: "6h ago",
    title: "Introducing Variables 2.0: Design Tokens Meet Real Logic",
    excerpt: "Variables in Figma now support conditional logic and cross-file references, enabling richer design systems.",
    tag: "Design",
    category: "Design",
    unread: false,
    saved: true
  },
  {
    id: "6",
    source: "Vercel Blog",
    ago: "7h ago",
    title: "Frontend Observability: Finding UX Regressions Before Users Do",
    excerpt: "We instrumented Web Vitals and user flows to catch regressions early and tie product metrics to release decisions.",
    tag: "Backend & DevOps",
    category: "Backend & DevOps",
    unread: false,
    saved: false
  },
  {
    id: "7",
    source: "UX Collective",
    ago: "9h ago",
    title: "Designing Fast Information-Dense Interfaces Without Clutter",
    excerpt: "Information density can coexist with calm visual rhythm if hierarchy, spacing, and motion are intentional.",
    tag: "Design",
    category: "Design",
    unread: true,
    saved: false
  }
];

const state = {
  activeFilter: "all",
  query: "",
  viewMode: "list"
};

const refs = {
  allItemsCount: document.getElementById("allItemsCount"),
  savedCount: document.getElementById("savedCount"),
  unreadCountLabel: document.getElementById("unreadCountLabel"),
  categoryList: document.getElementById("categoryList"),
  itemsList: document.getElementById("itemsList"),
  emptyState: document.getElementById("emptyState"),
  updatesBanner: document.getElementById("updatesBanner"),
  updatesText: document.getElementById("updatesText"),
  searchInput: document.getElementById("searchInput"),
  refreshBtn: document.getElementById("refreshBtn"),
  markAllReadBtn: document.getElementById("markAllReadBtn"),
  sidebarPrimaryNav: document.getElementById("sidebarPrimaryNav")
};

function getUnreadCount() {
  return items.filter((item) => item.unread).length;
}

function getSavedCount() {
  return items.filter((item) => item.saved).length;
}

function getCategoryCount(categoryName) {
  return items.filter((item) => item.category === categoryName).length;
}

function getFilteredItems() {
  const lowered = state.query.trim().toLowerCase();

  return items.filter((item) => {
    if (state.activeFilter === "saved" && !item.saved) {
      return false;
    }

    if (state.activeFilter !== "all" && state.activeFilter !== "saved" && item.category !== state.activeFilter) {
      return false;
    }

    if (!lowered) {
      return true;
    }

    return [item.title, item.excerpt, item.source, item.tag].some((field) =>
      field.toLowerCase().includes(lowered)
    );
  });
}

function renderCounts() {
  refs.allItemsCount.textContent = String(items.length);
  refs.savedCount.textContent = String(getSavedCount());
  refs.unreadCountLabel.textContent = `${getUnreadCount()} unread`;
}

function renderCategoryList() {
  refs.categoryList.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-link";
    button.dataset.filter = category.name;
    button.style.setProperty("--dot", category.dot);

    if (state.activeFilter === category.name) {
      button.classList.add("is-active");
    }

    const label = document.createElement("span");
    label.textContent = category.name;

    const count = document.createElement("span");
    count.className = "count";
    count.textContent = String(getCategoryCount(category.name));

    button.append(label, count);
    refs.categoryList.appendChild(button);
  });
}

function createItemCard(item) {
  const card = document.createElement("article");
  card.className = "item-card";
  card.dataset.itemId = item.id;

  if (!item.unread) {
    card.classList.add("is-read");
  }

  const dot = document.createElement("span");
  dot.className = "unread-dot";
  dot.setAttribute("aria-hidden", "true");

  const main = document.createElement("div");
  main.className = "item-main";

  const meta = document.createElement("p");
  meta.className = "item-meta";

  const sourceBadge = document.createElement("span");
  sourceBadge.className = "source-badge";
  sourceBadge.style.background = sourceColors[item.source] || "#6b7280";
  sourceBadge.textContent = item.source.charAt(0);

  const sourceText = document.createElement("span");
  sourceText.textContent = `${item.source} - ${item.ago}`;

  meta.append(sourceBadge, sourceText);

  const title = document.createElement("h2");
  title.className = "item-title";
  title.textContent = item.title;

  const excerpt = document.createElement("p");
  excerpt.className = "item-excerpt";
  excerpt.textContent = item.excerpt;

  const tag = document.createElement("span");
  tag.className = "topic-tag";
  tag.textContent = item.tag;

  const tagStyle = tagColors[item.tag] || { bg: "#eef2ff", fg: "#3730a3" };
  tag.style.setProperty("--tag-bg", tagStyle.bg);
  tag.style.setProperty("--tag-fg", tagStyle.fg);

  main.append(meta, title, excerpt, tag);

  const actions = document.createElement("div");
  actions.className = "item-actions";

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "save-btn";
  saveBtn.dataset.action = "toggle-save";
  saveBtn.dataset.itemId = item.id;
  saveBtn.setAttribute("aria-label", item.saved ? "Unsave article" : "Save article");
  saveBtn.textContent = item.saved ? "*" : "+";

  if (item.saved) {
    saveBtn.classList.add("is-saved");
  }

  actions.appendChild(saveBtn);
  card.append(dot, main, actions);

  return card;
}

function renderItems() {
  const filtered = getFilteredItems();

  refs.itemsList.classList.remove("is-list", "is-grid", "is-compact");
  refs.itemsList.classList.add(`is-${state.viewMode}`);
  refs.itemsList.innerHTML = "";

  filtered.forEach((item) => {
    refs.itemsList.appendChild(createItemCard(item));
  });

  refs.emptyState.hidden = filtered.length > 0;
}

function renderSideActiveState() {
  const allLinks = document.querySelectorAll(".side-link, .category-link");
  allLinks.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.activeFilter);
  });
}

function renderAll() {
  renderCounts();
  renderCategoryList();
  renderSideActiveState();
  renderItems();
}

function showUpdatesBanner(count) {
  refs.updatesText.textContent = `${count} new items since your last visit`;
  refs.updatesBanner.hidden = false;
}

function markAllRead() {
  getFilteredItems().forEach((item) => {
    item.unread = false;
  });
  renderAll();
}

function refreshFeed() {
  const bumped = Math.floor(Math.random() * 6) + 1;
  const unreadItems = items.filter((item) => item.unread);

  unreadItems.slice(0, bumped).forEach((item) => {
    item.unread = true;
  });

  showUpdatesBanner(bumped);
  renderAll();
}

function toggleSave(itemId) {
  const item = items.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  item.saved = !item.saved;
  renderAll();
}

function attachEvents() {
  refs.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderItems();
  });

  refs.sidebarPrimaryNav.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) {
      return;
    }

    state.activeFilter = button.dataset.filter;
    renderAll();
  });

  refs.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) {
      return;
    }

    state.activeFilter = button.dataset.filter;
    renderAll();
  });

  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewMode = button.dataset.view;

      document.querySelectorAll(".view-btn").forEach((other) => {
        other.classList.toggle("is-active", other === button);
      });

      renderItems();
    });
  });

  refs.refreshBtn.addEventListener("click", refreshFeed);
  refs.markAllReadBtn.addEventListener("click", markAllRead);

  refs.itemsList.addEventListener("click", (event) => {
    const actionBtn = event.target.closest("button[data-action='toggle-save']");
    if (!actionBtn) {
      return;
    }

    toggleSave(actionBtn.dataset.itemId);
  });

  refs.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      refs.searchInput.value = "";
      state.query = "";
      renderItems();
    }
  });
}

attachEvents();
renderAll();
showUpdatesBanner(5);
