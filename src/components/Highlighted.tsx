import React from 'react';

interface HighlightedProps {
    text: string
    highlight: string
}

const Highlighted: React.FC<HighlightedProps> = ({text = '', highlight = ''}) => {
    if (!highlight.trim()) {
        return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    return (
        <span>
        {parts.filter(part => part).map((part, i) => (
            regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        ))}
    </span>
    )
}

export default Highlighted;
