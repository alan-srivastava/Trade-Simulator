#pragma once

#include <QWidget>
#include <QComboBox>
#include <QDoubleSpinBox>
#include <QVBoxLayout>
#include <QLabel>
#include <QGroupBox>

struct SimulationInputs {
    QString exchange;
    QString asset;
    QString orderType;
    double quantity;
    double volatility;
    QString feeTier;
};

class InputPanel : public QWidget {
    Q_OBJECT

public:
    explicit InputPanel(QWidget *parent = nullptr);
    SimulationInputs getInputs() const;

signals:
    void inputChanged();

private:
    void setupUI();
    void createExchangeSection();
    void createAssetSection();
    void createOrderSection();
    void createQuantitySection();
    void createVolatilitySection();
    void createFeeTierSection();

    QComboBox* exchangeCombo;
    QComboBox* assetCombo;
    QComboBox* orderTypeCombo;
    QDoubleSpinBox* quantitySpinBox;
    QDoubleSpinBox* volatilitySpinBox;
    QComboBox* feeTierCombo;
};