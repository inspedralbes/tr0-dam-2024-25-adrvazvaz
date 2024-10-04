import json as js
import numpy as np
import pandas as pd

llista = [1,5,8,12,3,455,6,7,88,99,100]

for num in llista:
    if num % 2 == 0:
        llista.remove(num)

print(llista)