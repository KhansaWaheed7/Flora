import pandas as pd


DATASET_PATH = "data/pcos.xlsx"


def main():

    print("\n========================================")
    print("       PCOS DATASET AUDIT")
    print("========================================\n")

    # -----------------------------------------
    # Load workbook
    # -----------------------------------------

    excel_file = pd.ExcelFile(DATASET_PATH)

    print("Available sheets:")
    for sheet in excel_file.sheet_names:
        print(f"  - {sheet}")

    print()

    # -----------------------------------------
    # Load Full_new sheet
    # -----------------------------------------

    df = pd.read_excel(
        DATASET_PATH,
        sheet_name="Full_new"
    )

    # Clean column names
    df.columns = df.columns.str.strip()

    # -----------------------------------------
    # Basic information
    # -----------------------------------------

    print("Dataset shape:")
    print(f"Rows    : {df.shape[0]}")
    print(f"Columns : {df.shape[1]}")

    print("\n========================================")
    print("COLUMN NAMES")
    print("========================================\n")

    for i, column in enumerate(df.columns, start=1):
        print(f"{i:02d}. {column}")

    # -----------------------------------------
    # Target distribution
    # -----------------------------------------

    target = "PCOS (Y/N)"

    print("\n========================================")
    print("TARGET DISTRIBUTION")
    print("========================================\n")

    if target in df.columns:

        print(df[target].value_counts(dropna=False))

        print("\nTarget percentages:")

        percentages = (
            df[target]
            .value_counts(normalize=True, dropna=False)
            .mul(100)
            .round(2)
        )

        print(percentages)

    else:

        print(f"WARNING: Target column '{target}' not found.")

    # -----------------------------------------
    # Missing values
    # -----------------------------------------

    print("\n========================================")
    print("MISSING VALUES")
    print("========================================\n")

    missing = df.isnull().sum()

    missing = missing[missing > 0].sort_values(
        ascending=False
    )

    if len(missing) == 0:

        print("No missing values found.")

    else:

        print(missing)

    # -----------------------------------------
    # Data types
    # -----------------------------------------

    print("\n========================================")
    print("DATA TYPES")
    print("========================================\n")

    print(df.dtypes)

    # -----------------------------------------
    # Duplicate rows
    # -----------------------------------------

    print("\n========================================")
    print("DUPLICATES")
    print("========================================\n")

    duplicates = df.duplicated().sum()

    print(f"Duplicate rows: {duplicates}")

    # -----------------------------------------
    # Unique values for selected features
    # -----------------------------------------

    important_columns = [
        "Age (yrs)",
        "BMI",
        "Cycle length(days)",
        "Cycle(R/I)",
        "Weight gain(Y/N)",
        "Pimples(Y/N)",
        "Hair loss(Y/N)",
        "hair growth(Y/N)",
        "Skin darkening (Y/N)",
        "Reg.Exercise(Y/N)",
        "Fast food (Y/N)",
        "PCOS (Y/N)",
    ]

    print("\n========================================")
    print("SELECTED FEATURE VALUES")
    print("========================================\n")

    for column in important_columns:

        if column not in df.columns:
            print(f"{column}: NOT FOUND")
            continue

        print(f"\n{column}")

        values = df[column].value_counts(
            dropna=False
        )

        print(values.head(20))

    # -----------------------------------------
    # Numerical summary
    # -----------------------------------------

    print("\n========================================")
    print("NUMERICAL SUMMARY")
    print("========================================\n")

    numerical = df.select_dtypes(
        include="number"
    )

    if not numerical.empty:

        print(
            numerical.describe().round(2).to_string()
        )

    # -----------------------------------------
    # Finished
    # -----------------------------------------

    print("\n========================================")
    print("AUDIT COMPLETE")
    print("========================================\n")


if __name__ == "__main__":
    main()