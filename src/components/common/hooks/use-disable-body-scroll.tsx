import { useEffect } from 'react';

export const useDisableBodyScroll = (open: boolean) => {
    console.log(open)
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [open]);
};