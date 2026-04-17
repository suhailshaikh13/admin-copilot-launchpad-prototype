import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #2f3130;
  margin: 0;
`

const CardRow = styled.div`
  display: flex;
  gap: 12px;
`

const Card = styled.div`
  flex: 1;
  background: white;
  border: 1px solid #dcdcda;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CardTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  margin: 0;
`

const CardTitleLink = styled.a`
  color: #406cc4;
  text-decoration: underline;
  text-decoration-skip-ink: none;
  cursor: pointer;

  &:hover {
    color: #284173;
  }

  &:active {
    color: #1f335a;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 1px white, 0 0 0 4px #406cc4;
    border-radius: 8px;
  }
`

const StatGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StatLabel = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.0004px;
  color: #2f3130;
  margin: 0;
`

const StatLabelSubtle = styled(StatLabel)`
  color: #646864;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 6px;
  background: rgba(100, 104, 100, 0.16);
  position: relative;
`

const ProgressFill = styled.div<{ $percent: number }>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${({ $percent }) => $percent}%;
  border-radius: 6px;
  background: #406cc4;
`

const StatValue = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  margin: 0;

  strong {
    font-weight: 600;
  }
`

export default function Usage() {
  return (
    <Container>
      <SectionTitle>Usage</SectionTitle>
      <CardRow>
        <Card>
          <CardTitle><CardTitleLink href="#">Storage usage</CardTitleLink></CardTitle>
          <StatGroup>
            <StatLabel>Ticket data storage</StatLabel>
            <ProgressBar>
              <ProgressFill $percent={88.33} />
            </ProgressBar>
            <StatValue>
              <strong>2.4</strong> of 20,000 MB used
            </StatValue>
          </StatGroup>
          <StatGroup>
            <StatLabel>File storage</StatLabel>
            <ProgressBar>
              <ProgressFill $percent={93.33} />
            </ProgressBar>
            <StatValue>
              <strong>4.2</strong> of 510,000 MB used
            </StatValue>
          </StatGroup>
        </Card>

        <Card>
          <CardTitle>
            <CardTitleLink href="#">API usage</CardTitleLink>
            {' '}
            <span style={{ color: '#2f3130', fontWeight: 400 }}>(last 7 days)</span>
          </CardTitle>
          <StatGroup>
            <StatLabelSubtle>429 errors</StatLabelSubtle>
            <StatValue>
              <strong>0%</strong> of requests
            </StatValue>
          </StatGroup>
          <StatGroup>
            <StatLabelSubtle>Limit near-breaches</StatLabelSubtle>
            <StatValue>
              <strong>0</strong>
            </StatValue>
          </StatGroup>
          <StatGroup>
            <StatLabelSubtle>Limit approaches</StatLabelSubtle>
            <StatValue>
              <strong>0</strong>
            </StatValue>
          </StatGroup>
        </Card>

        <Card>
          <CardTitle><CardTitleLink href="#">Automated resolutions usage</CardTitleLink></CardTitle>
          <StatValue>
            <strong>2 of 9000</strong>
          </StatValue>
          <StatGroup>
            <StatLabelSubtle>Allowance usage</StatLabelSubtle>
            <StatValue>
              <strong>0%</strong>{' '}
              <span style={{ fontWeight: 400, marginLeft: 16 }}>Overage allowed</span>
            </StatValue>
          </StatGroup>
          <StatGroup>
            <StatLabelSubtle>Days elapsed</StatLabelSubtle>
            <StatValue>
              <strong>151 of 365</strong>{' '}
              <span style={{ color: '#646864', fontWeight: 400, marginLeft: 16 }}>41.4%</span>
            </StatValue>
          </StatGroup>
        </Card>
      </CardRow>
    </Container>
  )
}
