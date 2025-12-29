import { cache } from 'react';
import { makeQueryClient } from './react-query.client';

export const getQueryClient = cache(makeQueryClient);
