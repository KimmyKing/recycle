import dva from 'dva';
import axios from 'axios';
import './index.css';

axios.defaults.baseURL = 'http://127.0.0.1:8081';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/home').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
