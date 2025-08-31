// src/types/tanstack-table.d.ts
import { RowData } from '@tanstack/react-table'

// 扩展 @tanstack/react-table 的 ColumnMeta 接口
declare module '@tanstack/react-table' {
  // 必须保留泛型参数 TData 和 TValue，否则会覆盖原始类型
  interface ColumnMeta<_TData extends RowData, _TValue> {
    className?: string // 自定义列样式类名
    label?: string // 自定义中文标签
  }
}
