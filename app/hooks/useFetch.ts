// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useEffect, useState } from 'react';
import { useGlobalUserDetailsContext } from '@/providers/UserDetailsContext';
import { useCache } from '@/providers/CachedDataContext';
import { customUrlFetch } from '@/backend-calls/customUrlFetch';

type CustomAxiosConfig = {
	body: object;
	url: string;
	key: string;
	initialEnabled?: boolean;
	cache?: {
		enabled?: boolean;
		tte?: number;
	};
	// onSuccess?: (data) => void;
	// onFailure?: (err) => void;
};

export default function useFetch<T = any>({ url, key, initialEnabled = true, cache, body }: CustomAxiosConfig) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<T | undefined>();
	const [error, setError] = useState<string>();
	const { getCache, setCache, deleteCache } = useCache();

	const { userId, address } = useGlobalUserDetailsContext();

	const refetch = async (hard: boolean = false) => {
		setLoading(true);
		setError(undefined);
		if (cache?.enabled && getCache(key) !== undefined && !hard) {
			setData(getCache(key));
			setLoading(false);
			setError(undefined);
			return;
		}

		const { data: resData, error: resError } = await customUrlFetch<T>({ address, body, url });

		if (resData && !resError) {
			setData(resData);
			if (cache?.enabled) setCache(key, resData, cache.tte);
		} else {
			setData(undefined);
			setError(resError);
		}

		setLoading(false);
	};

	function inValidate(invalidationKey: string) {
		deleteCache(invalidationKey);
	}

	useEffect(() => {
		if (!userId) return;
		if (initialEnabled) refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId]);

	return { data, error, inValidate, loading, refetch } as const;
}
