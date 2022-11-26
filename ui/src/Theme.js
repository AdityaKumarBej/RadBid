import {createMuiTheme} from '@material-ui/core/styles';
import {blue, red}      from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: blue[300],
            main: blue[500],
            dark: blue[700],
        },
        secondary: {
            light: blue[300],
            main: blue[500],
            dark: blue[700],
        },
        error: {
            main: red.A400,
        },
        background: {
          default: '#fff',
        }
    }
});

export default theme;