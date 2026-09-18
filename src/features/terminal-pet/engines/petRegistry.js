const pets = new Map()

export function registerPet(id) {
  pets.set(id, { x: 0, y: 0 })
}

export function unregisterPet(id) {
  pets.delete(id)
}

export function updatePetPosition(id, x, y) {
  const entry = pets.get(id)
  if (entry) {
    entry.x = x
    entry.y = y
  }
}

export function getOtherPositions(id) {
  const others = []
  for (const [otherId, pos] of pets) {
    if (otherId !== id) others.push(pos)
  }
  return others
}
