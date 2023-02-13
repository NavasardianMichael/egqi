import { combineClassNames } from "helpers/functions/commons"
import { FC, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from './portal.module.css'

type T_Props = {
    children: JSX.Element
    opened: boolean
    close: () => void
}

export const Portal: FC<T_Props> = ({ children, opened, close }) => {

    const handleOverlayClick = useCallback(() => close(), [close])

    const handleCloseBtnClick = useCallback(() => close(), [close])

    useEffect(() => {
        document.body.style.overflow = opened ? 'hidden' : 'overlay'
    }, [opened])

    return createPortal(
        <div className={combineClassNames([styles.portal, opened ? undefined : styles.closed])}>
            <div className={styles.portal_content}>
                {children}
                <button onClick={handleCloseBtnClick} className={styles.portal_close_btn}>
                    <i className="bi bi-x"></i>
                </button>
            </div>
            <div
                onClick={handleOverlayClick} 
                className={styles.portal_overlay} 
            />
        </div>,
        document.getElementById('root-portal') as HTMLDivElement
    )
}