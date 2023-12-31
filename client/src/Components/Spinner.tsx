import React from "react";
import "./Spinner.css";

function LoadingText(count: number) {
  return (
    <div className="loading__text flex justify-center">Loaded {count} of 2</div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full loader"></div>
    </div>
  );
}
export function SpinnerBike(props: { fetchedDataCount: number }) {
  return (
    <div className="flex flex-col mx-auto h-screen">
      <div className="bike">
        <div className="wheel wheel__left">
          <div className="spoke spoke__left--1"></div>
          <div className="spoke spoke__left--2"></div>
          <div className="hub"></div>
        </div>
        <div className="wheel wheel__right">
          <div className="spoke spoke__right--1"></div>
          <div className="spoke spoke__right--2"></div>
          <div className="hub"></div>
        </div>
        <div className="fork"></div>
        <div className="chainring"></div>
        <div className="down-tube"></div>
        <div className="top-tube"></div>
        <div className="seat-tube"></div>
        <div className="seat-stay"></div>
        <div className="chain-stay"></div>
        <div className="chain__upper"></div>
        <div className="chain__bottom"></div>
        <div className="saddle"></div>
        <div className="handlebars"></div>
      </div>
      {LoadingText(props.fetchedDataCount)}
    </div>
  );
}
