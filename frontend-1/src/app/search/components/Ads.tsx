'use client'
import { useEffect } from 'react'
import Script from 'next/script'

export default function SearchAdds() {
    useEffect(() => {
        const loadAds = () => {
            try {
                // Seleccionamos el elemento que no tenga el atributo de "procesado"
                const insElement = document.querySelector('.adsbygoogle:not([data-adsbygoogle-status="done"])');
                
                if (typeof window !== 'undefined' && (window as any).adsbygoogle && insElement) {
                    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                }
            } catch (e) {
                console.error("Error al inicializar AdSense:", e);
            }
        };

        // Pequeño delay para asegurar que el DOM y el script de Google estén listos
        const timer = setTimeout(loadAds, 500);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9961121545451444"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />

            <div className="xl:order-2 order-1 w-[300px] h-[814px] bg-[#d9d9d9] justify-center items-center gap-2.5 mt-4
            xl:mr-8   
            lg:flex
            hidden">
                <ins className="adsbygoogle"
                     style={{ display: 'block', width: '300px', height: '814px' }}
                     data-ad-client="ca-pub-9961121545451444"
                     data-ad-slot="5592697478"
                     data-ad-format="vertical"
                     data-full-width-responsive="false">
                </ins>
            </div>
        </>
    )
}