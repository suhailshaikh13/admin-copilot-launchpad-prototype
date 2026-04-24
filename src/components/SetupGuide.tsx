import styled from 'styled-components'
import { Button, Anchor, Code } from '@zendesk-ui/react-components'
import ArrowLeftStrokeIcon from '@zendeskgarden/svg-icons/src/16/arrow-left-stroke.svg?react'

interface SetupGuideProps {
  onBack: () => void
}

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const BackButton = styled(Button)`
  align-self: flex-start;
  margin-bottom: 8px;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 400;
  color: #313131;
  margin: 0;
`

const IntroText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #49545C;
  margin: 0;
`

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const Step = styled.div`
  display: flex;
  gap: 16px;
`

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9256B1 30%, #1F73B7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`

const StepContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StepTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #313131;
  margin: 4px 0 0 0;
`

const StepDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #49545C;
  margin: 0;
`

const CodeBlock = styled.pre`
  background: #F8F9F9;
  border: 1px solid #D8DCDE;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #2F3941;
  overflow-x: auto;
  margin: 0;
`

const HelpSection = styled.div`
  margin-top: 16px;
  padding: 20px;
  background: #F8F9F9;
  border-radius: 12px;
  border: 1px solid #D8DCDE;
`

const HelpText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #49545C;
  margin: 0;
`

export function SetupGuide({ onBack }: SetupGuideProps) {
  return (
    <Container>
      <BackButton onClick={onBack} isBasic>
        <Button.StartIcon>
          <ArrowLeftStrokeIcon />
        </Button.StartIcon>
        Back to Home
      </BackButton>

      <div>
        <Title>Local Setup Guide</Title>
        <IntroText style={{ marginTop: '16px' }}>
          The Admin Copilot requires a local development environment to connect to AWS Bedrock.
          When deployed to GitHub Pages, the app runs as a static site without the necessary backend proxy.
          Follow these steps to run the prototype on your machine.
        </IntroText>
      </div>

      <StepsContainer>
        <Step>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Clone the repository</StepTitle>
            <StepDescription>
              Open your terminal and clone the repository to your local machine:
            </StepDescription>
            <CodeBlock>git clone https://github.com/zendesk/Admin-Copilot-Prototype.git{'\n'}cd Admin-Copilot-Prototype</CodeBlock>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Initialize private packages</StepTitle>
            <StepDescription>
              This prototype uses private Zendesk UI packages from Artifactory. If you have{' '}
              <Anchor href="https://claude.ai/code" isExternal>Claude Code</Anchor> installed,
              run the initialization command:
            </StepDescription>
            <CodeBlock>/prototype:init</CodeBlock>
            <StepDescription>
              This will authenticate with Artifactory and install all dependencies.
            </StepDescription>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Create and add AWS Bedrock credentials</StepTitle>
            <StepDescription>
              Create your credentials at{' '}
              <Anchor href="https://ai-gateway.zende.sk/applications" isExternal>
                ai-gateway.zende.sk/applications
              </Anchor>
              , then add them to your shell configuration file:
            </StepDescription>
            <CodeBlock>
              {'# Add to ~/.zshrc or ~/.bashrc\n'}
              {'export AWS_ENDPOINT_URL_BEDROCK_RUNTIME="<your-endpoint>"\n'}
              {'export AWS_BEARER_TOKEN_BEDROCK="<your-token>"'}
            </CodeBlock>
            <StepDescription>
              After saving, reload your shell configuration:
            </StepDescription>
            <CodeBlock>source ~/.zshrc</CodeBlock>
          </StepContent>
        </Step>

        <Step>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Start the development server</StepTitle>
            <StepDescription>
              Run the Vite dev server, which includes the proxy for AWS Bedrock:
            </StepDescription>
            <CodeBlock>npm run dev</CodeBlock>
            <StepDescription>
              Open your browser to <Code>http://localhost:5173</Code> and the copilot will work as expected.
            </StepDescription>
          </StepContent>
        </Step>
      </StepsContainer>

      <HelpSection>
        <HelpText>
          <strong>Still having issues?</strong> Reach out to <Code>@gsysko</Code> on Zendesk Slack for assistance.
        </HelpText>
      </HelpSection>
    </Container>
  )
}
