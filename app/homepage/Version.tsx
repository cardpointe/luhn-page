import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Track } from '../track';

type VersionData = {
    commit: string;
    lastmod: string;
    tech: string;
}

export function Version() {
    const { t, i18n } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const [statusData, setStatusData] = useState({ commit: '', lastmod: '', tech: '' } as VersionData);

    useEffect(() => {
        console.log('Fetching status...');
        // Fetch the status data from the server
        fetch('/status.json')
            .then(response => response.json())
            .then(data => {
                console.log('Status fetched:', data);
                setStatusData(data);
            })
            .catch(error => {
                console.error('Error fetching status data:', error);
            });
    }, []);

    const handleClick = () => {
        const theDialog = document.getElementById("version-dialog")
        if (!theDialog) {
            console.log("Null menu!?!");
            return;
        }
        Track('page', 'view', 'about');
        (theDialog as HTMLDialogElement).showModal();
    };

    const handleClose = () => {
        setAnchorEl(null);
        const theDialog = document.getElementById("version-dialog")
        if (!theDialog) {
            console.log("Null menu!?!");
            return;
        }
        Track('page', 'close', 'about');
        (theDialog as HTMLDialogElement).close();
    };


    return (
        <>
            <div
                className=""
                id="version-button"
                aria-controls={open ? 'version-dialog' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <img src="/logo.svg" alt="logo" className="h-10" />
            </div>
            <dialog
                className="modal p-5"
                id="version-dialog"
                open={open}
                onClose={() => handleClose()}
            >
                <div className="modal-box flex flex-col gap-0 p-0">
                    <span className="p-3 text-xl font-bold border-b border-neutral/50">{t('version_title')}</span>

                    <table className="mx-3 table-auto border-separate border-spacing-y-3" suppressHydrationWarning={true}>
                        <tbody>
                            <tr>
                                <td>{t('version_commit')}</td>
                                <td>{statusData.commit /* LATER: hyperlink to source */}</td>
                            </tr>
                            <tr>
                                <td>{t('version_lastmod')}</td>
                                <td className="whitespace-nowrap">{statusData.lastmod}</td>
                            </tr>
                            <tr>
                                <td>{t('version_tech')}</td>
                                <td className="whitespace-nowrap">{statusData.tech}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center p-3">
                        <button
                            className="btn btn-fiserv w-full"
                            onClick={() => {
                                handleClose();
                            }}>{t('settings_close')}</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
