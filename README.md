# zhiliao-native

## 运行

删除node_modules/static-container/StaticContainer.js中static PropTypes声明

## react-native-web性能优化

将node_modules/react-native-web/dist/modules/StyleSheetPropType/index.js中

```js
export default StyleSheetPropType;
```

替换为

```js
export default function(){return function(){};};
```
