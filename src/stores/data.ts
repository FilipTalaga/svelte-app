import { derived } from 'svelte/store';
import type { LegalEntity, TemplateDocument } from '../types/invoice';
import { get } from '../utils/store';

export const templates = derived(
    get<TemplateDocument>('templates/:user'),
    $val => $val?.templates || []
);

export const company = get<LegalEntity>('companies/:user');
