// import { DataGrid } from '@mui/x-data-grid';
import MUIDataTable from 'mui-datatables';
// import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createTheme, ThemeProvider } from '@mui/material';

const muiCache = createCache({
    "key": "mui",
    "prepend": true
});

const getMuiTheme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "none"
                }
            }
        }
    }
})

export const CustomDataGrid = (props) => {
    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={getMuiTheme}>
                <MUIDataTable
                    key={props.dtKey}
                    title={props.title}
                    data={props.data}
                    columns={props.columns}
                    options={props.options ? props.options : {}}
                />
            </ThemeProvider>
        </CacheProvider>
    );
}