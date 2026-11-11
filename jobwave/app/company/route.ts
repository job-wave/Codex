import {companyHtml} from './content';
import {htmlResponse} from '../guides/content';
export function GET(){return htmlResponse(companyHtml().replace('<script src="/guide-page.js" defer></script>',''))}
