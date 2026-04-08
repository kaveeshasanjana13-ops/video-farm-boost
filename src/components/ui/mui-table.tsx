import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useResizableColumns } from '@/hooks/useResizableColumns';
import { useColumnConfig, type ColumnDef } from '@/hooks/useColumnConfig';
import ColumnConfigurator from '@/components/ui/column-configurator';
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}
interface MUITableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  customActions?: Array<{
    label: string;
    action: (row: any) => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    className?: string;
    condition?: (row: any) => boolean; // Optional condition to show/hide action per row
    disabledCondition?: (row: any) => boolean; // Optional condition to disable action per row
    disabledLabel?: string; // Label to show when disabled
  }>;
  // Pagination props
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  // Section type for different behaviors
  sectionType?: 'lectures' | 'homework' | 'exams' | 'students' | 'classes' | 'subjects' | 'class-subjects';
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  /** Unique key for persisting column visibility per table (defaults to title-based key) */
  storageKey?: string;
}
export default function MUITable({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  customActions = [],
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [25, 50, 100],
  sectionType,
  allowAdd = true,
  allowEdit = true,
  allowDelete = true,
  storageKey = '',
}: MUITableProps) {
  const {
    user
  } = useAuth();
  const instituteRole = useInstituteRole();
  
  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onRowsPerPageChange(newRowsPerPage);
    onPageChange(0);
  };

  // Permission checks using institute role
  const canAdd = allowAdd && onAdd && (instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher');
  const canEdit = allowEdit && onEdit && (instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher');
  const canDelete = allowDelete && onDelete && (instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher');

  // ── Action columns: each action gets its own resizable+configurable column ──
  const actionCols = React.useMemo<Column[]>(() => {
    const isAdminOrTeacher = instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher';
    const isStudent = instituteRole === 'Student';
    const cols: Column[] = [];
    if (onView && sectionType !== 'lectures')
      cols.push({ id: '_act_view', label: sectionType === 'exams' ? 'View Results' : 'View', minWidth: 90, align: 'center' as const });
    const hasEditForAdmin = allowEdit && onEdit && isAdminOrTeacher;
    const hasDeleteForAdmin = allowDelete && onDelete && isAdminOrTeacher;
    if (hasEditForAdmin || (isStudent && sectionType === 'homework' && onEdit)) {
      const label = (isStudent && sectionType === 'homework') ? 'Submit' : (hasDeleteForAdmin ? 'Actions' : 'Edit');
      const minWidth = hasDeleteForAdmin ? 110 : 80;
      cols.push({ id: '_act_edit', label, minWidth, align: 'center' as const });
    } else if (hasDeleteForAdmin) {
      cols.push({ id: '_act_delete', label: 'Delete', minWidth: 90, align: 'center' as const });
    }
    customActions.forEach((action, i) =>
      cols.push({ id: `_act_cust_${i}`, label: action.label, minWidth: 120, align: 'center' as const })
    );
    return cols;
  }, [onView, onEdit, onDelete, allowEdit, allowDelete, sectionType, instituteRole, customActions]);
  const hasActions = actionCols.length > 0;
  const allColumns = React.useMemo(() => [...columns, ...actionCols], [columns, actionCols]);

  // ── Column resizing (via shared hook) ───────────────────────────
  const colDefaultWidths = React.useMemo(() => {
    const m: Record<string, number> = {};
    allColumns.forEach(c => { m[c.id] = c.minWidth || 150; });
    return m;
  }, [allColumns]);
  const colIds = React.useMemo(() => allColumns.map(c => c.id), [allColumns]);
  const { getWidth, totalWidth: totalTableWidth, setHoveredCol, ResizeHandle } =
    useResizableColumns(colIds, colDefaultWidths);

  // ── Column visibility (user-configurable) ────────────────────────
  const columnDefsForConfig = React.useMemo<ColumnDef[]>(() => [
    ...columns.map((col, i) => ({
      key: col.id,
      header: col.label,
      defaultVisible: true,
      locked: i === 0,
      defaultWidth: col.minWidth || 150,
      minWidth: col.minWidth || 80,
    })),
    ...actionCols.map(col => ({
      key: col.id,
      header: col.label,
      defaultVisible: true,
      locked: false,
      defaultWidth: col.minWidth || 90,
      minWidth: 60,
    })),
  ], [columns, actionCols]);
  const cfgKey = storageKey || `muitbl-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const { colState, visibleColumns: visibleDataColDefs, toggleColumn, resetColumns } = useColumnConfig(columnDefsForConfig, cfgKey);
  const visibleKeys = React.useMemo(() => new Set(visibleDataColDefs.map(c => c.key)), [visibleDataColDefs]);
  const visibleDataColumns = React.useMemo(() => columns.filter(col => visibleKeys.has(col.id)), [columns, visibleKeys]);
  const visibleAllColumns = React.useMemo(() => [
    ...visibleDataColumns,
    ...actionCols.filter(col => visibleKeys.has(col.id)),
  ], [visibleDataColumns, actionCols, visibleKeys]);
  const visibleTotalWidth = React.useMemo(() =>
    visibleAllColumns.reduce((sum, col) => sum + getWidth(col.id), 0),
    [visibleAllColumns, getWidth]
  );

  return <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex justify-end mb-2">
        <ColumnConfigurator
          allColumns={columnDefsForConfig}
          colState={colState}
          onToggle={toggleColumn}
          onReset={resetColumns}
        />
      </div>
      {/* Table */}
      <Paper sx={{
      width: '100%',
      overflow: 'hidden',
      height: 'calc(100vh - 260px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
        <TableContainer sx={{
        flex: 1,
        overflow: 'auto'
      }}>
          <Table stickyHeader aria-label="sticky table" sx={{ tableLayout: 'fixed', minWidth: visibleTotalWidth }}>
            <TableHead>
              <TableRow>
                {visibleAllColumns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      /* NOTE: NO overflow:hidden here — it clips the absolute resize handle */
                      width: getWidth(column.id),
                      minWidth: getWidth(column.id),
                      maxWidth: getWidth(column.id),
                      position: 'relative',
                      userSelect: 'none',
                    }}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'hsl(var(--muted))',
                      color: 'hsl(var(--foreground))',
                      borderBottom: '1px solid hsl(var(--border))',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={() => setHoveredCol(column.id)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: !column.id.startsWith('_act') ? 12 : 0 }}>
                      {column.label}
                    </div>
                    <ResizeHandle colId={column.id} isActions={column.id.startsWith('_act')} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => {
              console.log('Row data:', row, 'Index:', index);
              return <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map(column => {
                  const isVisible = visibleKeys.has(column.id);
                  if (!isVisible) return null;
                  const value = row[column.id];
                  console.log(`Column ${column.id}:`, value, 'from row:', row);
                  const renderer = (column as any).format || (column as any).render;
                  let cellContent: React.ReactNode = renderer ? renderer(value, row) : (value || '-');
                  if (!renderer) {
                    const id = (column.id || '').toLowerCase();
                    const isLikelyImage = typeof value === 'string' && (value.startsWith('http') || value.startsWith('/')) && /\.(png|jpe?g|gif|webp|svg)$/i.test(value);
                    const isImageColumn = id.includes('image') || id.includes('img') || id.includes('logo');
                    if ((isLikelyImage || isImageColumn) && typeof value === 'string') {
                      cellContent = (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={value}
                            alt={`${column.label} image`}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                          />
                        </div>
                      );
                    }
                  }
                  return <TableCell key={column.id} align={column.align} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: getWidth(column.id), maxWidth: getWidth(column.id) }}>
                        {cellContent}
                      </TableCell>;
                })}
                    {actionCols.map(col => {
                      if (!visibleKeys.has(col.id)) return null;
                      const isAdminOrTeacher = instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher';
                      const cellStyle = { width: getWidth(col.id), maxWidth: getWidth(col.id) };
                      if (col.id === '_act_view') {
                        const canSee = isAdminOrTeacher || (instituteRole === 'Student' && sectionType === 'homework') || sectionType === 'students';
                        return (
                          <TableCell key={col.id} align="center" style={cellStyle}>
                            {onView && canSee && (
                              <Button variant="default" size="sm" onClick={() => onView!(row)} className="h-8 px-3 text-xs">
                                <Eye className="h-3 w-3 mr-1" />{col.label}
                              </Button>
                            )}
                          </TableCell>
                        );
                      }
                      if (col.id === '_act_edit') {
                        return (
                          <TableCell key={col.id} align="center" style={cellStyle}>
                            <div className="flex items-center justify-center gap-1">
                              {onEdit && isAdminOrTeacher && (
                                <Button variant="outline" size="sm" onClick={() => onEdit!(row)} className="h-8 w-8 p-0" title="Edit">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {onEdit && isAdminOrTeacher && allowDelete && onDelete && (
                                <Button variant="destructive" size="sm" onClick={() => onDelete!(row)} className="h-8 w-8 p-0" title="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {onEdit && instituteRole === 'Student' && sectionType === 'homework' && (
                                <Button variant="default" size="sm" onClick={() => onEdit!(row)} className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                                  <Plus className="h-3 w-3 mr-1" />Submit
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        );
                      }
                      if (col.id === '_act_delete') {
                        return (
                          <TableCell key={col.id} align="center" style={cellStyle}>
                            {canDelete && onDelete && isAdminOrTeacher && (
                              <Button variant="destructive" size="sm" onClick={() => onDelete!(row)} className="h-8 px-3 text-xs">
                                <Trash2 className="h-3 w-3 mr-1" />Delete
                              </Button>
                            )}
                          </TableCell>
                        );
                      }
                      if (col.id.startsWith('_act_cust_')) {
                        const idx = parseInt(col.id.replace('_act_cust_', ''));
                        const action = customActions[idx];
                        if (!action) return null;
                        if (action.condition && !action.condition(row)) return <TableCell key={col.id} style={cellStyle} />;
                        const isDisabled = action.disabledCondition ? action.disabledCondition(row) : false;
                        const buttonLabel = isDisabled && action.disabledLabel ? action.disabledLabel : action.label;
                        return (
                          <TableCell key={col.id} align="center" style={cellStyle}>
                            <Button
                              variant={isDisabled ? 'secondary' : (action.variant || 'outline')}
                              size="sm"
                              onClick={() => !isDisabled && action.action(row)}
                              title={buttonLabel}
                              disabled={isDisabled}
                              className={`h-8 px-3 text-xs ${action.className || ''} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {buttonLabel}
                            </Button>
                          </TableCell>
                        );
                      }
                      return null;
                    })}
                  </TableRow>;
            })}
              {data.length === 0 && <TableRow>
                  <TableCell colSpan={visibleAllColumns.length} align="center">
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">No records found</p>
                    </div>
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={rowsPerPageOptions} component="div" count={totalCount} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} sx={{ flexShrink: 0, borderTop: '1px solid hsl(var(--border))' }} />
      </Paper>
    </div>;
}