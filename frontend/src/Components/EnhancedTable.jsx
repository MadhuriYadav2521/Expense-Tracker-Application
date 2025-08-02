import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox,
    IconButton, Tooltip, Switch, FormControlLabel, Chip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({ headCells, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
    const createSortHandler = (property) => (event) => onRequestSort(event, property);

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align='left'
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <label style={{ fontSize: "14px", fontWeight: "bold" }}
                        >
                            {headCell.label}
                        </label>
                    </TableCell>
                ))}
                <TableCell sx={{ fontSize: "14px", fontWeight: "bold" }} >Action</TableCell>

            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar({ numSelected, deleteTransactions, selected, openFilter, filters, clearFilters }) {
    console.log(filters, "filters from childddddddddd");


    return (
        <>
            <Toolbar
                sx={[
                    { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
                    numSelected > 0 && {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    },
                ]}
            >
                {numSelected > 0 ? (
                    <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <>
                        <Typography sx={{ flex: '1 1 100%', fontWeight: "bold", fontSize: "22px" }} variant="h6">
                            Transactions
                        </Typography>

                    </>

                )}
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton onClick={() => deleteTransactions(selected)}><DeleteIcon sx={{ color: 'red', }} /></IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip title="Filter list" onClick={() => openFilter()}>
                            <IconButton><FilterAltIcon sx={{ color: '#FFBF00', fontSize: "24px" }} /></IconButton>
                        </Tooltip>
                        {filters &&
                            <Tooltip title="Clear filter" onClick={() => clearFilters()}>
                                <IconButton><FilterAltOffIcon sx={{ color: 'red', fontSize: "24px" }} /></IconButton>
                            </Tooltip>
                        }
                    </>
                )}


            </Toolbar>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 1,
                    mt: 1,
                    width: '100%',
                    '@media (max-width:600px)': {
                        justifyContent: 'flex-start',
                        gap: '6px',
                    },
                    padding: "0px 10px 10px 10px"
                }}
            >
                {Object.entries(filters || {}).map(([key, value]) => {
                    if (!value) return null;

                    const labelMap = {
                        category: "Category",
                        date: "Date",
                        fromDate: "From",
                        toDate: "To"
                    };

                    return (
                        <Chip
                            key={key}
                            label={`${labelMap[key] || key}: ${value}`}
                            sx={{
                                color: 'black',
                                borderRadius: '7px',
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                                textTransform: "capitalize"
                            }}
                        />
                    );
                })}
            </Box>
        </>
    );
}

const EnhancedTable = ({ rows, headCells, onSelectionChange, deleteTransactions, onEdit, openFilter, filters, clearFilters, clearSelectionCount, resetTablePage, clearReset }) => {

    const [order, setOrder] = React.useState(null);
    const [orderBy, setOrderBy] = React.useState(headCells[0]?.id || '');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        if (resetTablePage) {
            setPage(0);
        }
    }, [resetTablePage]);

    React.useEffect(() => {
        if (resetTablePage && typeof clearReset === 'function') {
            clearReset(); 
        }
    }, [resetTablePage]);


    React.useEffect(() => {
        setSelected([]);
    }, [clearSelectionCount]);

    React.useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selected);
        }
    }, [selected, onSelectionChange]);

    console.log(selected, "selected");

    const handleEditClick = (row) => {
        if (typeof onEdit === "function") {
            onEdit(row);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((item) => item !== id);
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => setDense(event.target.checked);

    const visibleRows = React.useMemo(() => {
        let processedRows = [...rows];
        if (order && orderBy) {
            processedRows = processedRows.sort(getComparator(order, orderBy));
        }
        return processedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [order, orderBy, page, rowsPerPage, rows]);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} deleteTransactions={deleteTransactions} selected={selected} openFilter={openFilter} filters={filters} clearFilters={clearFilters} />
                <TableContainer>
                    <Table size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead
                            headCells={headCells}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />

                        {rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={headCells.length + 2} align="center">
                                    <Typography variant="subtitle1" sx={{ py: 2, fontWeight: '500', color: '#666' }}>
                                        No data available.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}

                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.includes(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} />
                                        </TableCell>
                                        {headCells.map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                align='left'
                                                padding={cell.disablePadding ? 'none' : 'normal'}
                                                sx={{
                                                    textTransform: "capitalize",
                                                    ...(cell.id === 'description' && {
                                                        maxWidth: 200,
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                    }),
                                                }}
                                            >
                                                {cell.id === 'transactionType' ? (
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            backgroundColor: row[cell.id] === 'income' ? '#C8E6C9' : '#FFCDD2',
                                                            color: row[cell.id] === 'income' ? '#256029' : '#C62828',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {row[cell.id]}
                                                    </Box>
                                                ) : (
                                                    row[cell.id]
                                                )}
                                            </TableCell>

                                        ))}
                                        <TableCell >
                                            <Tooltip title="Edit">
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleEditClick(row); }}>
                                                    <EditIcon sx={{ color: '#0073e6', }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={headCells.length + 1} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
        </Box>
    );
};

EnhancedTable.propTypes = {
    rows: PropTypes.array.isRequired,
    headCells: PropTypes.array.isRequired,
    onSelectionChange: PropTypes.func,
    onEdit: PropTypes.func,

};

export default EnhancedTable;
