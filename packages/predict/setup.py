from setuptools import setup, find_packages

setup(
    name="xiao-liuren-predict",
    version="1.0.0",
    description="小六壬預測系統 - Chinese traditional divination tool",
    author="Alex Family",
    packages=find_packages(),
    install_requires=[],
    python_requires=">=3.7",
    entry_points={
        "console_scripts": [
            "xiao-liuren=xiao_liu_ren:main",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Home Automation",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
)
