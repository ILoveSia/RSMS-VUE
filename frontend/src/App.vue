<template>
  <div id="app">
    <el-container>
      <el-header style="background-color: #409EFF; color: white;">
        <h2>RSMS Vue Test Page</h2>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: #f5f7fa;">
          <el-menu :default-active="$route.path" router>
            <!-- <el-menu-item index="/organizations">
              <span>조직관리</span>
            </el-menu-item> -->
            <el-menu-item index="/positions">
              <span>직책관리</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
</script>

<style>
#app {
  height: 100vh;
}
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
}
.el-aside {
  padding-top: 20px;
}
</style>
