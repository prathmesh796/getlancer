"use client"

import { GoogleAnalytics } from '@next/third-parties/google'
import { usePathname } from 'next/navigation';

const AnalyticsProvider = () => {
    const pathname = usePathname();

    const skipRoutes = ['/reset-password', '/verify'];
    const shouldTrack = !skipRoutes.includes(pathname);

    return (
        <>
            {shouldTrack && process.env.NODE_ENV === "production" && process.env.E2E_TEST !== "1" && <GoogleAnalytics gaId={process.env.GA_TRACKING_ID} />}
        </>
    )
}

export default AnalyticsProvider