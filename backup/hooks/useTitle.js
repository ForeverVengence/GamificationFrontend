import { useEffect } from 'react';

const SUFFIX = ' | BigBrain';

function useTitle(title, useSuffix = true) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title}${useSuffix ? SUFFIX : ''}`;
    return () => {
      document.title = prev;
    };
  }, [title, useSuffix]);
}

export default useTitle;
