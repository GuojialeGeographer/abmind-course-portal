# ABMind Course Portal - 真实数据更新记录

## 更新概述

根据校核.md文件中的真实信息，已将课程门户中的虚构内容替换为真实的讲师信息、项目资源和社区链接。

## 主要更新内容

### 1. 讲师信息更新

**原虚构讲师** → **真实讲师**
- Dr. Zhang Wei, Prof. Li Ming → Shuang Song, Boyu Wang
- Dr. Chen Lu, Prof. Wang Xiaoli → Boyu Wang, Xin Lin  
- Prof. Liu Jianhong, Dr. Zhang Yifei → Jiale Guo, Adam Zhou

### 2. 新增真实讲师档案文件

创建了 `data/instructors.yaml` 包含以下真实讲师信息：

- **Shuang Song** - 马克思·普朗克研究所博士后研究员
- **Xin Lin** - 中国地质大学硕士研究生，Mesa贡献者
- **Jiale Guo** - 米兰理工大学硕士生，GISphere成员
- **Bo Hu** - 南京大学博士生，ABMind运营
- **Boyu Wang** - 布法罗大学博士生，Mesa核心开发者
- **Adam Zhou** - 伦敦大学学院博士生

### 3. 课程内容更新

#### 新增课程
- **Mesa 3.0：Python Agent-Based Modeling 新手指南** (2025)
  - 基于真实的ABMind社区文章内容
  - 涵盖建模、分析、可视化三大模块

#### 更新现有课程
- 所有课程的讲师信息已更新为真实人员
- 课程材料链接指向真实的GitHub仓库和个人主页
- 参考资料更新为真实的Mesa官方文档

### 4. 资源库更新

**替换虚构资源** → **真实Mesa资源**
- Mesa官方文档: http://mesa.readthedocs.org/
- Mesa入门教程: 官方tutorial链接
- Mesa可视化教程: 官方visualization tutorial
- Mesa GitHub讨论区: 真实社区链接
- GSoC Mesa项目: 真实的GSoC中文资料
- Complexity Explorer课程: Santa Fe Institute的真实在线课程

### 5. 网站配置更新

#### 社交链接更新
- GitHub - SongshGeoLab: https://github.com/SongshGeoLab
- GitHub - Mesa Project: https://github.com/projectmesa/mesa
- PaperBell: https://paperbell.cn/
- DHTech: https://dh-tech.github.io/
- GISphere: https://gisphere.info/school

#### 公告更新
- Mesa 3.0 新手指南发布 (2025/2/18)
- ABMind 中文社区正式启动 (2024/12/11)  
- Mesa GSoC 2025 项目启动 (2024/12/10)

### 6. 学习路径更新

- 将新的Mesa 3.0指南设为推荐课程
- 更新学习路径引用真实课程内容
- 保持原有的结构化学习设计

## 验证结果

- ✅ 所有数据验证测试通过
- ✅ YAML格式正确
- ✅ 链接指向真实资源
- ✅ 讲师信息准确

## 保留的设计元素

- 原有的UI设计和颜色方案
- 网站结构和导航
- 响应式布局
- 无障碍功能
- 多语言支持框架

## 技术细节

- 所有URL已验证为有效链接
- 引用类型符合schema验证规则
- 课程ID保持唯一性
- 数据格式符合TypeScript类型定义

这次更新成功地将虚构的演示内容替换为真实的ABMind社区和Mesa项目信息，同时保持了原有的优秀设计和用户体验。