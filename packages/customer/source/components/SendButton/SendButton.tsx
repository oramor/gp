type SendButtonProps = {
    title: string;
    isRequested: boolean;
    onClick?: () => void;
};

export function SendButton({ onClick, isRequested, title }: SendButtonProps) {
    return (
        <button type="button" onClick={onClick}>
            {isRequested ? title : 'Loading...'}
        </button>
    );
}
