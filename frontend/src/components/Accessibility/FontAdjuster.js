import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Type } from 'lucide-react';
import './FontAdjuster.css';

const FontAdjuster = () => {
    const { fontSize, setFontSize, speak } = useAccessibility();

    const fontSizes = [
        { key: 'small', label: 'Small', value: '0.9em' },
        { key: 'medium', label: 'Medium', value: '1em' },
        { key: 'large', label: 'Large', value: '1.3em' },
        { key: 'extra-large', label: 'Extra Large', value: '1.6em' }
    ];

    const handleFontSizeChange = (newSize) => {
        setFontSize(newSize);
        const sizeLabel = fontSizes.find(s => s.key === newSize)?.label;
        speak(`Font size changed to ${sizeLabel}`);
    };

    return (
        <motion.div
            className="accessibility-widget font-adjuster"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="widget-header">
                <Type size={20} />
                <span>Font Size</span>
            </div>

            <div className="font-size-options">
                {fontSizes.map((size) => (
                    <motion.button
                        key={size.key}
                        className={`font-size-btn ${fontSize === size.key ? 'active' : ''}`}
                        onClick={() => handleFontSizeChange(size.key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ fontSize: size.value }}
                    >
                        {size.label}
                    </motion.button>
                ))}
            </div>

            <div className="font-preview">
                <p style={{ fontSize: fontSizes.find(s => s.key === fontSize)?.value }}>
                    This is how your text will look with the selected font size.
                </p>
            </div>
        </motion.div>
    );
};

export default FontAdjuster;
