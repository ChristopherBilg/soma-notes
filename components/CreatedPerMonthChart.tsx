// Copyright 2023-Present Soma Notes
import { ChartDataset } from "chart-js/auto/auto.d.ts";
import { ChartJs } from "fresh-charts/deps.ts";
import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export type ChartType = ChartJs.ChartType;
export type DefaultDataPoint<TType extends ChartType> =
  ChartJs.DefaultDataPoint<TType>;

export type ChartProps<
  Type extends ChartType,
  Data = DefaultDataPoint<Type>,
  Label = unknown,
> = ChartJs.ChartConfiguration<Type, Data, Label> & {
  canvas?: JSX.HTMLAttributes<HTMLCanvasElement>;
};

const useChart = <
  Type extends ChartType,
  Data = DefaultDataPoint<Type>,
  Label = unknown,
>(options: ChartJs.ChartConfiguration<Type, Data, Label>) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJs.Chart<Type, Data, Label> | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      throw new Error("Canvas is null and cannot be used to create chart.");
    }
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new ChartJs.Chart(
      canvasRef.current,
      options,
    );

    return () => {
      chartRef.current?.destroy();
    };
  }, [canvasRef, options]);

  return { canvasRef, chartRef };
};

type CreatedPerMonthChartProps = {
  datasets: ChartDataset[];
};

const CreatedPerMonthChart = ({ datasets }: CreatedPerMonthChartProps) => {
  const { canvasRef, chartRef } = useChart({
    type: "line",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      normalized: true,
    },
  });

  useEffect(() => {
    chartRef.current?.render();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "clamp(300px, 50%, 600px)",
      }}
    />
  );
};

export default CreatedPerMonthChart;
