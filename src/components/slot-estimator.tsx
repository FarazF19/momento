"use client";

import { useMemo, useState } from "react";

const presets = [150, 250, 500, 800];

export function SlotEstimator() {
  const [slots, setSlots] = useState(8);
  const [price, setPrice] = useState(250);
  const total = useMemo(() => slots * price, [slots, price]);

  return (
    <div className="slot-estimator">
      <div>
        <label htmlFor="est-slots">Numbered slots</label>
        <input id="est-slots" type="range" min={4} max={15} value={slots} onChange={(event) => setSlots(Number(event.target.value))} />
        <b>{slots} zones</b>
      </div>
      <div>
        <label htmlFor="est-price">Ask per slot</label>
        <input id="est-price" type="range" min={50} max={2000} step={50} value={price} onChange={(event) => setPrice(Number(event.target.value))} />
        <div className="slot-estimator-presets">
          {presets.map((value) => (
            <button key={value} type="button" className={price === value ? "is-on" : ""} onClick={() => setPrice(value)}>
              ${value}
            </button>
          ))}
        </div>
      </div>
      <p className="slot-estimator-total">
        <span>If every slot fills</span>
        <strong>${total.toLocaleString()}</strong>
      </p>
    </div>
  );
}
