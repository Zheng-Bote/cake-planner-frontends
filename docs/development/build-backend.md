<!-- DOCTOC SKIP -->

# CakePlanner Backend

## Build

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j$(nproc)
```

## Run

```bash
./build/CakePlanner
```

## kill

```bash
pkill -f CakePlanner
```
