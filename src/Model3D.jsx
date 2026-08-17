import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = import.meta.env.VITE_BEDROOM_MODEL_URL || '';

function tintMaterial(material, color) {
  if (!material) return;
  if (!material.color) material.color = new THREE.Color(color);
  else material.color.set(color);
}

export function RealBedroomModel({ woodColor, fabricColor = '#d6c7b5', metalColor = '#8d765e', scale = 1 }) {
  const { scene } = useGLTF(MODEL_URL, '/draco/');
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    cloned.traverse((object) => {
      if (!object.isMesh || !object.material) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        const name = `${object.name} ${material.name}`.toLowerCase();
        if (/fabric|textile|cloth|parche|پارچه/.test(name)) tintMaterial(material, fabricColor);
        else if (/metal|gold|brass|steel|فلز/.test(name)) tintMaterial(material, metalColor);
        else tintMaterial(material, woodColor);
        material.roughness = name.includes('metal') ? 0.25 : 0.42;
      });
    });
  }, [cloned, woodColor, fabricColor, metalColor]);

  return <primitive object={cloned} scale={scale} position={[0, -0.15, 0]} />;
}

export function hasRealBedroomModel() {
  return Boolean(MODEL_URL);
}

export const realBedroomModelUrl = MODEL_URL;
