@echo off
echo Compiling LaTeX slides to PDF...
echo.

REM Check if pdflatex is available
pdflatex --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: pdflatex not found!
    echo Please install MiKTeX or TeX Live
    echo Download from: https://miktex.org/ or https://www.tug.org/texlive/
    pause
    exit /b 1
)

REM Compile the LaTeX file
echo Running pdflatex (first pass)...
pdflatex student_guide.tex

echo Running pdflatex (second pass for references)...
pdflatex student_guide.tex

echo.
echo Compilation complete!
echo Check for student_guide.pdf in this directory.
echo.
pause
