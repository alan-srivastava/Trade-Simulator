#include "InputPanel.h"
#include <QFormLayout>

InputPanel::InputPanel(QWidget *parent)
    : QWidget(parent)
{
    setupUI();
}

void InputPanel::setupUI() {
    auto mainLayout = new QVBoxLayout(this);
    auto formLayout = new QFormLayout;

    
    createExchangeSection();
    createAssetSection();
    createOrderSection();
    createQuantitySection();
    createVolatilitySection();
    createFeeTierSection();

    
    formLayout->addRow("Exchange:", exchangeCombo);
    formLayout->addRow("Asset:", assetCombo);
    formLayout->addRow("Order Type:", orderTypeCombo);
    formLayout->addRow("Quantity (USD):", quantitySpinBox);
    formLayout->addRow("Volatility (%):", volatilitySpinBox);
    formLayout->addRow("Fee Tier:", feeTierCombo);

    
    auto groupBox = new QGroupBox("Input Parameters");
    groupBox->setLayout(formLayout);
    mainLayout->addWidget(groupBox);
    mainLayout->addStretch();
}

void InputPanel::createExchangeSection() {
    exchangeCombo = new QComboBox;
    exchangeCombo->addItem("OKX");
    exchangeCombo->setEnabled(false);
    
    connect(exchangeCombo, &QComboBox::currentTextChanged,
            this, &InputPanel::inputChanged);
}

void InputPanel::createAssetSection() {
    assetCombo = new QComboBox;
    assetCombo->addItems({"BTC-USDT", "ETH-USDT", "SOL-USDT", "XRP-USDT", "BNB-USDT"});
    
    connect(assetCombo, &QComboBox::currentTextChanged,
            this, &InputPanel::inputChanged);
}

void InputPanel::createOrderSection() {
    orderTypeCombo = new QComboBox;
    orderTypeCombo->addItems({"Market", "Limit"});
    
    connect(orderTypeCombo, &QComboBox::currentTextChanged,
            this, &InputPanel::inputChanged);
}

void InputPanel::createQuantitySection() {
    quantitySpinBox = new QDoubleSpinBox;
    quantitySpinBox->setRange(1, 1000000);
    quantitySpinBox->setValue(100);
    quantitySpinBox->setSingleStep(10);
    quantitySpinBox->setPrefix("$ ");
    
    connect(quantitySpinBox, &QDoubleSpinBox::valueChanged,
            this, &InputPanel::inputChanged);
}

void InputPanel::createVolatilitySection() {
    volatilitySpinBox = new QDoubleSpinBox;
    volatilitySpinBox->setRange(0.01, 1.00);
    volatilitySpinBox->setValue(0.05);
    volatilitySpinBox->setSingleStep(0.01);
    volatilitySpinBox->setDecimals(2);
    
    connect(volatilitySpinBox, &QDoubleSpinBox::valueChanged,
            this, &InputPanel::inputChanged);
}

void InputPanel::createFeeTierSection() {
    feeTierCombo = new QComboBox;
    feeTierCombo->addItems({"VIP1", "VIP2", "VIP3", "VIP4", "VIP5"});
    
    connect(feeTierCombo, &QComboBox::currentTextChanged,
            this, &InputPanel::inputChanged);
}
SimulationInputs InputPanel::getInputs() const {
    return {
        exchangeCombo->currentText(),
        assetCombo->currentText(),
        orderTypeCombo->currentText(),
        quantitySpinBox->value(),
        volatilitySpinBox->value(),
        feeTierCombo->currentText()
    };
}