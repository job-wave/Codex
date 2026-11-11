import {resourcesPreview} from '../service-preview';
import {memberGate} from '../member-access';
import {hubHtml} from './content';
import {htmlResponse} from '../guides/content';
export async function GET(){const membership=await memberGate("/resources");if(membership)return resourcesPreview();return htmlResponse(hubHtml())}
