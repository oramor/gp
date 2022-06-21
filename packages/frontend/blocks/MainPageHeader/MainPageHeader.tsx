import styles from './MainPageHeader.scss';

export function MainPageHeader() {
    console.log(styles);
    return (
        <div className={styles.div}>
            <span className={styles.span}>Главпоставка</span>
        </div>
    );
}
