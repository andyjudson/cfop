const pad2 = (value: number): string => value.toString().padStart(2, '0');

export const formatElapsedMs = (elapsedMs: number): string => {
  const safeMs = Math.max(0, Math.floor(elapsedMs));
  const totalSeconds = Math.floor(safeMs / 1000);
  const centiseconds = Math.floor((safeMs % 1000) / 10);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}:${pad2(seconds)}.${pad2(centiseconds)}`;
  }

  return `${seconds}.${pad2(centiseconds)}`;
};

