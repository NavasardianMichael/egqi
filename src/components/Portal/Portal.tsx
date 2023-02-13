import { FC } from "react"
import { createPortal } from "react-dom"
import styles from './portal.module.css'

type T_Props = {
    children: JSX.Element
}

export const Portal: FC<T_Props> = ({ children }) => {
    return createPortal(
        <>
            <div className={styles.portal_content}>
                {children}
            </div>
            <div className={styles.portal_overlay} />
        </>,
        document.getElementById('root-portal') as HTMLDivElement
    )
}