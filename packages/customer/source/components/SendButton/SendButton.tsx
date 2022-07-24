type SendButtonProps = {
    title: string;
    onClick?: () => void;
};

export function SendButton({ onClick, title }: SendButtonProps) {
    return (
        <button type="button" onClick={onClick}>
            {title}
        </button>
    );
}
