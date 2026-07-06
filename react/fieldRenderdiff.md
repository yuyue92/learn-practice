--- a/components/FieldRenderer.tsx
+++ b/components/FieldRenderer.tsx
@@ -8,6 +8,7 @@ interface FieldRendererProps {
     field: FieldConfig;
     ddeMemInfo: DdeMemInfo;
     setDdeMemInfo: (info: DdeMemInfo) => void;
     editFlag: boolean;
+    changed?: boolean; // 新增：该字段当前值是否与编辑前基准值不同，由父组件计算传入
 }
 
 export const FieldRenderer: React.FC<FieldRendererProps> = React.memo(({
     field,
     ddeMemInfo,
     setDdeMemInfo,
-    editFlag
+    editFlag,
+    changed = false
 }) => {
@@ -85,6 +86,17 @@ export const FieldRenderer: React.FC<FieldRendererProps> = React.memo(({
     let isDisabled = field.disabled !== undefined ? field.disabled : false;
     if (!editFlag) isDisabled = true;
 
+    // 变化高亮样式：仅在字段值与基准值不同时应用，不影响原有布局
+    const highlightSx = changed ? {
+        '& .MuiInputBase-root': {
+            backgroundColor: 'rgba(255, 167, 38, 0.12)' // 淡橙色底色
+        },
+        '& .MuiInput-underline:before': {
+            borderBottomColor: 'warning.main',
+            borderBottomWidth: '2px'
+        }
+    } : {};
+
     const renderField = () => {
         switch (field.type) {
             case 'amount':
                 return (
                     <TextField
                         value={displayValue}
                         hiddenLabel
                         size='small'
                         variant='standard'
                         disabled={isDisabled}
+                        sx={highlightSx}
                         inputProps={{
                             sx: { textAlign: 'right' },
                         }}
                         onChange={handleChange}
                         onFocus={handleFocus}
                         onBlur={handleBlur}
                     />
                 );
 
             case 'date':
             case 'text':
             default:
                 return (
                     <TextField
                         value={displayValue}
                         hiddenLabel
                         size='small'
                         variant='standard'
                         disabled={isDisabled}
+                        sx={highlightSx}
                         inputProps={{
                             'data-testid': field.testId,
                             ...(field.type === 'date' && { sx: { textAlign: 'center' } })
                         }}
                         error={valueError}
                         onChange={handleTextChange}
                     />
                 );
         }
     };
@@ -137,20 +149,20 @@ export const FieldRenderer: React.FC<FieldRendererProps> = React.memo(({
                 <Grid item xs={4}>
                     {
-                        (field.label.length < 16) ? (<Typography variant="subtitle1" color="text.secondary">
-                            {field.label}:
+                        (field.label.length < 16) ? (<Typography variant="subtitle1" color={changed ? 'warning.main' : 'text.secondary'}>
+                            {field.label}{changed ? ' •' : ''}:
                         </Typography>) : (<Tooltip title={field.label} placement="top" arrow>
                             <Typography
                                 variant="subtitle1"
-                                color="text.secondary"
+                                color={changed ? 'warning.main' : 'text.secondary'}
                                 sx={{
                                     overflow: 'hidden',
                                     textOverflow: 'ellipsis',
                                     whiteSpace: 'nowrap',
                                     cursor: 'help'
                                 }}
                             >
-                                {field.label}:
+                                {field.label}{changed ? ' •' : ''}:
                             </Typography>
                         </Tooltip>)
                     }
                 </Grid>
