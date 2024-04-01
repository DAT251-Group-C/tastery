const isValidUrl = (value: string | undefined | null): boolean => {
  if (value == null) {
    return true;
  }

  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return false;
  }

  if (value.includes('<' || '>')) {
    return false;
  }

  if (value.split('http://')?.[1]?.startsWith('/') || value.split('https://')?.[1]?.startsWith('/')) {
    return false;
  }

  try {
    const url = new URL(value);

    return Boolean(url) && !url.hostname.startsWith('.') && !url.hostname.startsWith('-') && !url.hostname.includes('..');
  } catch {
    return false;
  }
};

export { isValidUrl };
