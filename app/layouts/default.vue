<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <header class="navbar">
      <div class="navbar-content">
        <NuxtLink to="/" class="logo">
          <Icon name="carbon:z-axis" size="1.5em" class="logo-icon" />
          <span class="logo-text">Geometry Project</span>
        </NuxtLink>
        
        <nav class="nav-links">
          <NuxtLink to="/" class="nav-item">首页</NuxtLink>
          <NuxtLink to="/problems" class="nav-item">习题库</NuxtLink>
          <NuxtLink to="/about" class="nav-item">关于</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; {{ new Date().getFullYear() }} Geometry Project. Built with Nuxt 4.</p>
        <div class="social-links">
          <a href="#" class="social-link"><Icon name="mdi:github" /></a>
          <a href="#" class="social-link"><Icon name="mdi:twitter" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: white;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #1d1d1f;
  font-weight: 600;
  font-size: 1.1rem;
}

.logo-icon {
  color: #0071e3;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-item {
  text-decoration: none;
  color: #6e6e73;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-item:hover, .nav-item.router-link-active {
  color: #1d1d1f;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.footer {
  background-color: #f5f5f7;
  border-top: 1px solid #e5e5e5;
  padding: 30px 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #86868b;
  font-size: 0.85rem;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #86868b;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.social-link:hover {
  color: #1d1d1f;
}
</style>
