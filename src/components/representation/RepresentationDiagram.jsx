import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Shield, Users, Zap } from 'lucide-react';

export default function RepresentationDiagram({ theme = 'dark' }) {
  const isLight = theme === 'light';

  const steps = [
    {
      key: 's1',
      Icon: Users,
      iconBgDark: 'rgba(255,255,255,0.08)',
      iconBgLight: 'rgba(26,76,124,0.08)',
      iconColorDark: 'rgba(255,255,255,0.70)',
      iconColorLight: '#1A4C7C',
      labelDark: 'Supplier Intake',
      labelLight: 'Supplier Intake',
      labelColorLight: '#0D1B2A',
      iconColorSpecialLight: '#1A4C7C',
      description: ['Supplier leads enter via MSI.', 'Representation suppliers are imported via API.'],
    },
    {
      key: 's2',
      Icon: Activity,
      iconBgDark: 'rgba(26,76,124,0.30)',
      iconBgLight: 'rgba(26,76,124,0.10)',
      iconColorDark: '#7AB8E8',
      iconColorLight: '#1A4C7C',
      labelDark: 'Readiness Engine',
      labelLight: 'Readiness Engine',
      labelColorLight: '#0D1B2A',
      description: ['Every supplier is scored,', 'classified, and validated internally.'],
    },
    {
      key: 's3',
      Icon: Shield,
      iconBgDark: 'rgba(26,76,124,0.30)',
      iconBgLight: 'rgba(26,76,124,0.10)',
      iconColorDark: '#7AB8E8',
      iconColorLight: '#1A4C7C',
      labelDark: 'DIST Engine',
      labelLight: 'DIST Engine',
      labelColorLight: '#0D1B2A',
      description: ['Routing, classification block,', 'and eligibility confirmed.'],
    },
    {
      key: 's4',
      Icon: Zap,
      iconBgDark: 'rgba(212,168,87,0.15)',
      iconBgLight: 'rgba(212,168,87,0.12)',
      iconColorDark: '#E3C27A',
      iconColorLight: '#8B6914',
      labelDark: 'Surface Activation',
      labelLight: 'Surface Activation',
      labelColorLight: '#0D1B2A',
      description: ['Only suppliers who pass all', 'thresholds are activated for public display.'],
    },
    {
      key: 's5',
      Icon: Globe,
      iconBgDark: 'rgba(0,168,107,0.20)',
      iconBgLight: 'rgba(0,168,107,0.10)',
      iconColorDark: '#00C87E',
      iconColorLight: '#006B44',
      labelDark: 'MisconiUSADistribution.com',
      labelLight: 'MisconiUSADistribution.com',
      labelColorLight: '#006B44',
      description: ['Readiness-approved suppliers', 'appear publicly. Representation controlled', 'by Misconi USA.'],
      fontSizeLight: 12,
    },
  ];

  const labelColorDarkDefault = 'white';
  const descColorDark = 'rgba(255,255,255,0.55)';
  const descColorLight = '#4A4A4A';

  const stepVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0 },
  };

  const connectorGradientDark = 'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04))';
  const connectorGradientDarkLast = 'linear-gradient(to bottom, rgba(0,168,107,0.40), rgba(0,168,107,0.10))';
  const connectorGradientLight = 'linear-gradient(to bottom, rgba(26,76,124,0.15), rgba(26,76,124,0.04))';

  return (
    <div className="w-full flex flex-col">
      <style>{`
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
      {steps.map((s, idx) => {
        const iconBg = isLight ? s.iconBgLight : s.iconBgDark;
        const iconColor = isLight ? s.iconColorLight : s.iconColorDark;
        const labelColor = isLight
          ? s.labelColorLight
          : idx === 4
            ? '#00C87E'
            : labelColorDarkDefault;

        const descriptionColor = isLight ? descColorLight : descColorDark;

        const fontSizeLight = s.fontSizeLight;

        return (
          <React.Fragment key={s.key}>
            <motion.div
              className="w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stepVariants}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: idx * 0.10,
              }}
            >
              <div
                className="flex items-start gap-4"
                style={{
                  padding: '20px 0',
                }}
              >
                <div
                  className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{
                    background: iconBg,
                      animation: 'iconPulse 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                      animationDelay: `${idx * 0.10}s`,
                      transformOrigin: 'center',
                      willChange: 'transform',
                  }}
                >
                  <s.Icon size={20} color={iconColor} />
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="font-heading text-[15px] font-[700] mb-[4px]"
                    style={{
                      color: labelColor,
                    }}
                  >
                    {s.labelLight}
                  </div>

                  <div
                    className="font-body"
                    style={{
                      fontSize: isLight && fontSizeLight ? fontSizeLight : 13,
                      color: descriptionColor,
                      lineHeight: 1.55,
                      fontWeight: 400,
                    }}
                  >
                    {s.description.map((line, i) => (
                      <React.Fragment key={line}>
                        {i > 0 ? <br /> : null}
                        {line}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {idx !== steps.length - 1 && (
              <motion.div
                className="w-[2px] rounded-[2px]"
                style={{
                  marginLeft: 21,
                  height: 0,
                  background:
                    isLight
                      ? connectorGradientLight
                      : idx === 3
                        ? connectorGradientDarkLast
                        : connectorGradientDark,
                }}
                initial={{ height: 0 }}
                whileInView={{ height: 28 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.30,
                  ease: 'easeInOut',
                  delay: idx * 0.10,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

