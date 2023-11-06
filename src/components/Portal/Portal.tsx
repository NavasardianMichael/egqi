import { FC, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { combineClassNames } from "helpers/functions/commons"
import styles from './portal.module.css'

type T_Props = {
    children: JSX.Element
    opened: boolean
    close: () => void
    wrapperClassName?: string 
}

export const Portal: FC<T_Props> = ({ children, opened, wrapperClassName, close }) => {

    const handleOverlayClick = useCallback(() => close(), [close])

    const handleCloseBtnClick = useCallback(() => close(), [close])

    useEffect(() => {
        document.body.style.overflow = opened ? 'hidden' : 'overlay'
    }, [opened])

    return createPortal(
        <>
            <div className={combineClassNames([styles.portal_content, opened ? undefined : styles.closed, wrapperClassName])}>
                {children}
                <button onClick={handleCloseBtnClick} className={styles.portal_close_btn}>
                    <i className="bi bi-x"></i>
                </button>
            </div>
            {
                opened &&
                <div
                    onClick={handleOverlayClick} 
                    className={styles.portal_overlay}
                />
            }
        </>,
        document.getElementById('root-portal') as HTMLDivElement
    )
}