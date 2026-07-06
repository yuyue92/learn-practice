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

====================







--- a/pages/EDA/EdaCollection.tsx
+++ b/pages/EDA/EdaCollection.tsx
@@ -183,6 +183,22 @@ export default function EdaCollection() {
     const visibleFields = useMemo(
         () => filterFieldList.filter(v => !hideFields.includes(v.label)),
         [filterFieldList, hideFields]
     )
+    // 归一化比较，避免 string/number/null 类型不一致导致误判为"已修改"
+    const normalizeFieldValue = (v: any) => {
+        if (v === null || v === undefined) return '';
+        if (typeof v === 'string') return v.trim();
+        return v;
+    };
+    // 计算哪些字段的当前值(ddeMemInfo)与编辑前基准值(ddeMemInfoOld)不同
+    const changedFieldKeys = useMemo(() => {
+        const changed = new Set<string>();
+        if (!ddeMemInfo || !ddeMemInfoOld) return changed;
+        visibleFields.forEach(f => {
+            const oldVal = normalizeFieldValue(ddeMemInfoOld[f.key]);
+            const newVal = normalizeFieldValue(ddeMemInfo[f.key]);
+            if (oldVal !== newVal) changed.add(f.key);
+        });
+        return changed;
+    }, [ddeMemInfo, ddeMemInfoOld, visibleFields]);
     //过滤掉禁用的字段
     const enabledFields = useMemo(
@@ -376,6 +392,7 @@ export default function EdaCollection() {
     const handleSaveOrSubmitSuccessResponse = (res: any, msg: string, currentMemInfo: DdeMemInfo | null) => {
         if (!currentMemInfo) return;
         setRawResponseData(prev => {
             if (!prev) return prev;
             const extra = res && (typeof res === 'object') && ('errCount' in res) ? { errCount: res.errCount as number } : {}
             return {
                 ...prev,
                 ddeMemInfos: prev.ddeMemInfos.map(item =>
                     item.id === currentMemInfo.id ? { ...item, ...currentMemInfo, ...extra } : item
                 )
             }
         });
+        setddeMemInfoOld(currentMemInfo); // 保存/提交成功后重置基准值，清除已修改高亮
         message.success({ content: msg });
     }
@@ -594,13 +611,14 @@ export default function EdaCollection() {
                                     {visibleFields.map((fieldConfig) => {
                                         const disabled = !isEdit || !!fieldConfig.disabled
                                         return (
                                             <FieldRenderer
                                                 key={fieldConfig.key}
                                                 field={fieldConfig}
                                                 ddeMemInfo={safeMemInfo}
                                                 setDdeMemInfo={setDdeMemInfo}
                                                 editFlag={isEdit}
                                                 onEnter={handleFieldEnter}
                                                 registerRef={(fieldKey, el) => registerInputRef(fieldKey, el, disabled)}
+                                                changed={changedFieldKeys.has(fieldConfig.key)}
                                             />
                                         )
                                     })}
