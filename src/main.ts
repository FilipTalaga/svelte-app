/* Prototypes */
import './utils/number-prototypes';
import './utils/array-prototypes';
import './utils/string-prototypes';

/* External */
import 'pdfmake/build/vfs_fonts';

/* Application */
import App from './App.svelte';

/* Styles */
import './styles.scss';

const app = new App({
    target: document.body,
});

export default app;
