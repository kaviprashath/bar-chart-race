import React, { useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ChartConfig, InterpolatedEntity, RaceData } from '../types';

interface BarChartRaceProps {
  data: RaceData;
  config: ChartConfig;
  progress: number; // 0 to 1
}

const BarChartRace = forwardRef<HTMLCanvasElement, BarChartRaceProps>(({ data, config, progress }, ref) => {
  const innerRef = useRef<HTMLCanvasElement>(null);
  const imageCache = useRef<Record<string, HTMLImageElement>>({});

  // Sync the forwarded ref with our internal ref
  useImperativeHandle(ref, () => innerRef.current as HTMLCanvasElement, []);

  // Interpolation Logic
  const interpolatedFrame = useMemo(() => {
    if (!data.timeline || data.timeline.length < 2) return { date: "", entities: [] };

    const totalSegments = data.timeline.length - 1;
    const scaledProgress = Math.max(0, Math.min(progress, 1)) * totalSegments;
    const startIndex = Math.floor(scaledProgress);
    const endIndex = Math.min(startIndex + 1, totalSegments);
    const localT = scaledProgress - startIndex;

    const startFrame = data.timeline[startIndex];
    const endFrame = data.timeline[endIndex];
    
    if (!startFrame || !endFrame) return { date: "", entities: [] };

    const currentValues: InterpolatedEntity[] = data.entities.map(entity => {
      const startVal = startFrame.values[entity.id] || 0;
      const endVal = endFrame.values[entity.id] || 0;
      const val = startVal + (endVal - startVal) * localT;
      return { ...entity, value: val, rank: 0 };
    });

    currentValues.sort((a, b) => b.value - a.value);
    currentValues.forEach((item, index) => { item.rank = index; });

    let displayDate = startFrame.date;
    const startYear = parseInt(startFrame.date);
    const endYear = parseInt(endFrame.date);
    if (!isNaN(startYear) && !isNaN(endYear)) {
       const currentYear = Math.floor(startYear + (endYear - startYear) * localT);
       displayDate = currentYear.toString();
    }

    return { date: displayDate, entities: currentValues };
  }, [data, progress]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = innerRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas Resolution
    const width = canvas.width;
    const height = canvas.height;

    // Clear and Background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Settings for Layout (Scaled for 1920x1080)
    const padding = 60;
    const chartAreaTop = 200;
    const chartAreaBottom = height - 100;
    const maxBarWidth = width - padding * 2 - 250; 
    
    // Draw Title
    ctx.fillStyle = config.textColor;
    ctx.font = 'bold 60px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(data.title, padding, 80);

    // Draw Subtitle
    ctx.fillStyle = config.textColor;
    ctx.globalAlpha = 0.8;
    ctx.font = '40px Inter, sans-serif';
    ctx.fillText(data.subtitle, padding, 140);
    ctx.globalAlpha = 1.0;

    // Draw Date
    ctx.save();
    ctx.fillStyle = config.textColor;
    ctx.globalAlpha = 0.15;
    ctx.font = 'bold 350px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fontVariantCaps = 'all-small-caps'; 
    ctx.fillText(interpolatedFrame.date, width - padding, height - padding);
    ctx.restore();

    // Draw Source
    ctx.fillStyle = config.textColor;
    ctx.globalAlpha = 0.6;
    ctx.font = '24px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Source: ${data.source}`, width - padding, height - 30);
    ctx.globalAlpha = 1.0;

    // Draw Bars
    const maxValue = interpolatedFrame.entities[0]?.value || 1;
    
    interpolatedFrame.entities.forEach((entity) => {
      if (entity.rank >= config.topN) return;
      
      const barY = chartAreaTop + entity.rank * (config.barHeight + config.gap);
      if (barY > chartAreaBottom) return;

      const barWidth = (entity.value / maxValue) * maxBarWidth;
      const displayValue = Math.round(entity.value).toLocaleString();

      if (config.showIcons && entity.image && !imageCache.current[entity.image]) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = entity.image;
        imageCache.current[entity.image] = img;
      }

      // Draw Bar
      ctx.fillStyle = entity.color;
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(padding, barY, Math.max(barWidth, 4), config.barHeight, [0, 8, 8, 0]);
        ctx.fill();
      } else {
        ctx.fillRect(padding, barY, Math.max(barWidth, 4), config.barHeight);
      }

      // Draw Icon
      if (config.showIcons && entity.image && imageCache.current[entity.image]) {
        const img = imageCache.current[entity.image];
        if (img.complete && img.naturalWidth > 0) {
            const iconSize = config.barHeight * 0.8;
            const iconX = padding + barWidth - (iconSize / 2);
            const iconY = barY + (config.barHeight - iconSize) / 2;
            
            ctx.beginPath();
            ctx.arc(iconX + iconSize/2, iconY + iconSize/2, iconSize/2 + 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
            ctx.restore();
        }
      }

      // Draw Label
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      
      if (barWidth > 20) {
        ctx.fillText(entity.label, padding + 15, barY + config.barHeight / 2 + 8);
      }
      ctx.shadowBlur = 0; 

      // Value
      ctx.fillStyle = config.textColor;
      ctx.font = 'bold 30px Inter, sans-serif'; 
      ctx.textAlign = 'left';
      ctx.fillText(displayValue, padding + barWidth + 30, barY + config.barHeight / 2 + 10);

    });

  }, [interpolatedFrame, config, data]); 

  return (
    <canvas 
        ref={innerRef} 
        width={1920} 
        height={1080} 
        className="w-full h-full object-contain bg-slate-900 shadow-2xl"
    />
  );
});

export default BarChartRace;